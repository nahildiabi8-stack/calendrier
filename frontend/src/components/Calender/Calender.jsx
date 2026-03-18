import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import SideBar from "../SideBar/SideBar";
import Bouton from "../Bouton/Bouton";
import frLocale from "@fullcalendar/core/locales/fr";

export default function Calender() {
  const [showSideBar, setSideBar] = useState(false);
  const containerRef = useRef(null);
  const isDroppingRef = useRef(false);
  const [selectedPersonne, setSelectedPersonne] = useState(null);
  const [personnes, setPersonnes] = useState([]);
  const [events, setEvents] = useState([]);
  const [hiddenPersonnes, setHiddenPersonnes] = useState([]);

  const handleEventLeave = (info) => {
    if (isDroppingRef.current) return;

    const calendarEl = containerRef.current;
    const rect = calendarEl.getBoundingClientRect();
    const x = info.jsEvent.clientX;
    const y = info.jsEvent.clientY;

    const isInside =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    if (!isInside) {
      const eventId = info.event.id;
      fetch("/api/process/deleteEvenement.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId }),
      }).then(() => {
        info.event.remove();
      });
    }
  };

  useEffect(() => {
    fetchPersonnes();
    fetchEvenements();
  }, []);

  const fetchEvenements = () => {
    fetch(
      `/api/process/getEvenements.php?user_id=${localStorage.getItem("user_id")}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((ev) => ({
          id: ev.id,
          title: ev.texte,
          personne_id: ev.personne_id, // ← ajout
          start: `${ev.annee}-${String(ev.mois).padStart(2, "0")}-${String(ev.jour).padStart(2, "0")}T${ev.heure_debut || "00:00"}`,
          end: ev.heure_fin
            ? `${ev.annee}-${String(ev.mois).padStart(2, "0")}-${String(ev.jour).padStart(2, "0")}T${ev.heure_fin}`
            : null,
          backgroundColor: ev.color ? `#${ev.color}` : "rgba(0,0,0,0.8)",
        }));
        setEvents(formatted);
      });
  };

  const visibleEvents = events.filter(
    (ev) => !hiddenPersonnes.includes(ev.personne_id),
  );

  const fetchPersonnes = () => {
    fetch(
      `/api/process/getPersonnes.php?user_id=${localStorage.getItem("user_id")}`,
    )
      .then((res) => res.json())
      .then((data) => setPersonnes(data));
  };

  const handleDeletePersonne = (id) => {
    fetch("/api/process/removePersonnes.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(() => fetchPersonnes());
  };
  const handleAddPersonne = () => {
    const personneExistante = personnes.find((p) => p.nom === selectedPersonne);
    if (personneExistante) {
      setHiddenPersonnes((prev) => {
        const newHidden = prev.filter((id) => id !== personneExistante.id);
        localStorage.setItem("hiddenPersonnes", JSON.stringify(newHidden));
        return newHidden;
      });
    }

    fetch("/api/process/addPersonnes.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: selectedPersonne,
        user_id: localStorage.getItem("user_id"),
      }),
    })
      .then((res) => res.json())
      .then(() => fetchPersonnes());
  };

  return (
    <div
      ref={containerRef}
      className="animate-calendar"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <FullCalendar
        initialView="timeGridWeek" // ou "timeGridDay"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        events={visibleEvents} // ← change ça
        editable={true}
        locale={frLocale}
        eventResizableFromStart={true}
        droppable={true}
        eventDrop={(info) => {
          const start = info.event.start;
          const end = info.event.end;

          fetch("/api/process/updateDateEvenement.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: info.event.id,
              jour: start.getDate(),
              mois: start.getMonth() + 1,
              annee: start.getFullYear(),
              heure_debut: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
              heure_fin: end
                ? `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`
                : null,
            }),
          });
        }}
        eventResize={(info) => {
          const start = info.event.start;
          const end = info.event.end;

          fetch("/api/process/updateDateEvenement.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: info.event.id,
              jour: start.getDate(),
              mois: start.getMonth() + 1,
              annee: start.getFullYear(),
              heure_debut: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
              heure_fin: end
                ? `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`
                : null,
            }),
          });
        }}
        eventDragStop={handleEventLeave}
        eventReceive={(info) => {
          const date = info.event.start;
          fetch("/api/process/addEvenement.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: localStorage.getItem("user_id"),
              jour: date.getDate(),
              mois: date.getMonth() + 1,
              annee: date.getFullYear(),
              heure_debut: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
              heure_fin: `${String(date.getHours() + 1).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
              texte: info.event.title,
              personne_id: info.event.extendedProps.personne_id,
            }),
          }).then(() => fetchEvenements());
        }}
        dragRevertDuration={0}
        eventContent={(arg) => (
          <div
            style={{
              background: arg.event.backgroundColor || "rgba(0, 0, 0, 0.8)",
              borderRadius: "6px",
              padding: "4px 8px",
              width: "100%",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <input
              defaultValue={arg.event.title}
              onChange={(e) => arg.event.setProp("title", e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetch("/api/process/updateEvenement.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: arg.event.id,
                      texte: e.target.value,
                    }),
                  }).then(() => fetchEvenements());
                  e.target.blur();
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                width: "100%",
                cursor: "grab",
                fontWeight: "500",
              }}
            />
          </div>
        )}
      />

      <Bouton onClick={() => setSideBar(!showSideBar)} />
      {showSideBar && (
        <SideBar
          personnes={personnes}
          selectedPersonne={selectedPersonne}
          setSelectedPersonne={setSelectedPersonne}
          handleAddPersonne={handleAddPersonne}
          handleDeletePersonne={handleDeletePersonne}
          fetchPersonnes={fetchPersonnes}
          fetchEvenements={fetchEvenements}
          hiddenPersonnes={hiddenPersonnes} // ← ajout
          setHiddenPersonnes={setHiddenPersonnes} // ← ajout
          events={visibleEvents} // ← pas events={events}
        />
      )}
    </div>
  );
}
