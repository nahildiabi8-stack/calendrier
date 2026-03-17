import { useState, useRef, useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";
import Bouton from "../Bouton/Bouton";
import DropDown from "../DropDown/DropDown";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker"; // ✅ import direct PrimeReact

export default function SideBar({
  personnes,
  selectedPersonne,
  setSelectedPersonne,
  handleAddPersonne,
  handleDeletePersonne,
  fetchPersonnes,
  fetchEvenements,
}) {
  // ✅ Tous les hooks sont ICI, dans le corps du composant
  const [showDropdown, setShowDropdown] = useState(false);
  const [colors, setColors] = useState({});
  const [openPickerId, setOpenPickerId] = useState(null);
  const dragRef = useRef(null);

  const handleColorChange = (id, newColor) => {
    setColors((prev) => ({ ...prev, [id]: newColor }));

    fetch("/api/process/updateCouleurPersonne.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personne_id: id,
        color: newColor,
        user_id: localStorage.getItem("user_id"),
      }),
    }).then(() => {
      fetchPersonnes();
    });
  };

  useEffect(() => {
    const colorMap = {};
    personnes.forEach((personne) => {
      if (personne.color) {
        colorMap[personne.id] = personne.color;
      }
    });
    setColors(colorMap);
    fetchEvenements(); // ✅ Ajoute ça pour refresh les événements
  }, [personnes, fetchEvenements]); // ✅ Ajoute fetchEvenements aux dépendances
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
              key={personne.id}
              style={{ position: "relative", marginBottom: "6px" }} // ✅ relative sur le wrapper
            >
              <div
           
                data-id={personne.id}
                className="fc-event"
                onClick={(e) => {
                  e.stopPropagation(); // ✅ évite fermeture immédiate
                  setOpenPickerId(
                    openPickerId === personne.id ? null : personne.id,
                  );
                }}
                style={{
                  padding: "8px",
                  background: colors[personne.id]
                    ? `#${colors[personne.id]}`
                    : personne.color
                      ? `#${personne.color}`
                      : "#3b82f6", // ✅ Ajoute ça
                  color: "white",
                  borderRadius: "4px",
                  cursor: "grab",
                  userSelect: "none",
                }}
                
              >
                {personne.nom}
                
              </div>

              {openPickerId === personne.id && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 10,
                    top: "100%",
                    left: 0,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ColorPicker
                    inline
                    value={colors[personne.id] || "3b82f6"}
                    onChange={(e) => handleColorChange(personne.id, e.value)}
                  />
                </div>
              )}
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
