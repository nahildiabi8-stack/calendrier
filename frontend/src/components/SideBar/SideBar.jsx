import { useState, useRef, useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";
import Bouton from "../Bouton/Bouton";
import DropDown from "../DropDown/DropDown";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";

export default function SideBar({
  personnes,
  selectedPersonne,
  setSelectedPersonne,
  handleAddPersonne,
  handleDeletePersonne,
  fetchPersonnes,
  fetchEvenements,
  hiddenPersonnes, // ← ajout
  setHiddenPersonnes, // ← ajout
}) {
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
  const toggleHidePersonne = (id) => {
    setHiddenPersonnes((prev) => {
      const newHidden = prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id];
      // Sauvegarde en localStorage
      localStorage.setItem("hiddenPersonnes", JSON.stringify(newHidden));
      return newHidden;
    });
  };

  // Au démarrage, charge depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hiddenPersonnes");
    if (saved) {
      setHiddenPersonnes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    setHiddenPersonnes((prev) => {
      const filtered = prev.filter((id) => personnes.some((p) => p.id === id));
      localStorage.setItem("hiddenPersonnes", JSON.stringify(filtered));
      return filtered;
    });
  }, [personnes]);

  useEffect(() => {
    const colorMap = {};
    personnes.forEach((personne) => {
      if (personne.color) {
        colorMap[personne.id] = personne.color;
      }
    });
    setColors(colorMap);
    fetchEvenements();
  }, [personnes, fetchEvenements]);

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
          setHiddenPersonnes={setHiddenPersonnes} // ← ajout
        />
      )}

      <div ref={dragRef}>
        {Array.isArray(personnes) &&
          personnes.map((personne) => (
            <div
              key={personne.id}
              style={{ position: "relative", marginBottom: "6px" }}
            >
              {!hiddenPersonnes.includes(personne.id) && (
                <div
                  data-id={personne.id}
                  className="fc-event flex flex-row flex-wrap align-items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenPickerId(
                      openPickerId === personne.id ? null : personne.id,
                    );
                  }}
                  style={{
                    padding: "8px",
                    display: "flex",
                    flexDirection: "row",
                    background: colors[personne.id]
                      ? `#${colors[personne.id]}`
                      : personne.color
                        ? `#${personne.color}`
                        : "#6C63FF",
                    color: "white",
                    borderRadius: "4px",
                    cursor: "grab",
                    userSelect: "none",
                  }}
                >
                  {personne.nom}
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleHidePersonne(personne.id);
                      }}
                      icon="pi pi-eye"
                      style={{
                        height: "10px",
                        background: "transparent",
                        border: "none",
                      }}
                    />
                  </div>
                </div>
              )}

              {hiddenPersonnes.includes(personne.id) && (
                <div
                  className="flex flex-row flex-wrap align-items-center"
                  style={{
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    display: "flex",
                    flexDirection: "row",
                    background: colors[personne.id]
                      ? `#${colors[personne.id]}`
                      : personne.color
                        ? `#${personne.color}`
                        : "#6C63FF",
                    color: "white",
                    borderRadius: "4px",
                    opacity: 0.5,
                  }}
                >
                  {personne.nom}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleHidePersonne(personne.id);
                      }}
                      icon="pi pi-eye-slash"
                      style={{ background: "transparent", border: "none" }}
                    />
                  </div>
                </div>
              )}

              {openPickerId === personne.id &&
                !hiddenPersonnes.includes(personne.id) && (
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
