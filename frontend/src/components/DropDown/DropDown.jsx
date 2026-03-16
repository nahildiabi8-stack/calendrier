import { Dropdown } from "primereact/dropdown";

export default function DropDown({
  personnes,
  selectedPersonne,
  setSelectedPersonne,
  handleAddPersonne,
  handleDeletePersonne,
}) {
  const itemTemplate = (option) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span>{option.nom}</span>

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
    );
  };

  return (
    <Dropdown
      options={personnes}
      optionLabel="nom"
      value={selectedPersonne}
      onChange={(e) => setSelectedPersonne(e.value)}
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