import { Button } from "primereact/button";

export default function Bouton({ label, onClick, icon, style  }) {
  const handleClick = () => {
    const sound = new Audio("/assets/sounds/click.mp3");
    sound.play();
    onClick();
  };
  return (
    <div className="card flex flex-wrap justify-content-end ">
      <Button
        style={{ width: "100%", background: "#6c63ff", border: "none", ...style }}
        type="submit"
        label={label}
        icon={icon}
        onClick={handleClick}
      />
    </div>
  );
}
