import { Dropdown } from "primereact/dropdown";

export default function DropDown({
  personnes,
  selectedPersonne,
  setSelectedPersonne,
  handleAddPersonne,
  handleDeletePersonne,
  setHiddenPersonnes,
}) {
 const itemTemplate = (option) => {
  return (
    <div style={{ display: "flex", width: "248px" }}>
      <span>{option.nom}</span>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeletePersonne(option.id);
          }}
          style={{
            border: "none",
            background: "transparent",
            color: "white",
            cursor: "pointer",
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

  return (
    <Dropdown
      options={personnes}
      optionLabel="nom"
      value={selectedPersonne}
      onChange={(e) => {
        const selected = e.value;
        if (selected?.id) {
          setHiddenPersonnes((prev) => {
            const newHidden = prev.filter((id) => id !== selected.id);
            localStorage.setItem("hiddenPersonnes", JSON.stringify(newHidden));
            return newHidden;
          });
        }
        setSelectedPersonne(selected);
      }}
      editable
      placeholder="Ajoute un nom"
      itemTemplate={itemTemplate}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleAddPersonne();
      }}
      style={{
        width: "100%",
        background: "transparent",
        color: "white",
      }}
    />
  );
}