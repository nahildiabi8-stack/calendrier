import { InputText } from "primereact/inputtext";

export default function Input({
  type,
  placeholder,
  id,
  name,
  value,
  onChange,
  label,
}) {
  return (
   <div className="flex flex-column text-start gap-4 pt-3">
      <label>{label}</label>
      <InputText
      
        type={type}
        name={name}
        value={value}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        style={{ width: "100%" }}
      />
    </div>
  );
}
