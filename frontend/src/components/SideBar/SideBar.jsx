import { useState, useRef, useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";
import Bouton from "../Bouton/Bouton";
import DropDown from "../DropDown/DropDown";
import { Button } from "primereact/button";

export default function SideBar({
  personnes,
  selectedPersonne,
  setSelectedPersonne,
  handleAddPersonne,
  handleDeletePersonne,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dragRef = useRef(null);

  useEffect(() => {
    if (!dragRef.current) return;

    const draggable = new Draggable(dragRef.current, {
      itemSelector: ".fc-event",
      eventData: (eventEl) => ({
        title: eventEl.innerText,
        personne_id: eventEl.dataset.id,
      }),
    });
    return () => draggable.destroy();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: "300px",
        padding: "1rem",
        background: "rgba(45,45,45,0.3)",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        zIndex: "5",
      }}
    >
      <Bouton
        label="Ajouter personne"
        icon="pi pi-user"
        onClick={() => setShowDropdown(!showDropdown)}
      />
      {showDropdown && (
        <DropDown
          personnes={personnes}
          selectedPersonne={selectedPersonne}
          setSelectedPersonne={setSelectedPersonne}
          handleAddPersonne={handleAddPersonne}
          handleDeletePersonne={handleDeletePersonne}
        />
      )}

      <div ref={dragRef}>
        {Array.isArray(personnes) &&
          personnes.map((personne) => (
            <div
              data-id={personne.id}
              key={personne.id}
              className="fc-event"
              style={{
                padding: "8px",
                background: "#6c63ff",
                color: "white",
                marginBottom: "6px",
                borderRadius: "4px",
                cursor: "grab",
                userSelect: "none",
              }}
            >
              {personne.nom}
            </div>
          ))}
      </div>
      <div>
        <Button
          label="Logout"
          style={{ background: "red", width: "100%" }}
          onClick={() => {
            localStorage.removeItem("user_id");
            window.location.href = "/";
          }}
        />
      </div>
    </div>
  );
}
