import { useState } from "react";
import Input from "../Input/Input";
import Bouton from "../Bouton/Bouton";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({}) {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const navigate = useNavigate();
  const handleSubmit = () => {
    fetch("/api/process/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, password, email, age }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user_created) {
          navigate("/login");
        }
      });
  };
  return (
    <div
      className="flex flex-column align-items-center justify-content-center gap-4  "
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        className="shadow-3 p-4 border-round animate-register"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          width: "400px",
        }}
      >
        <p style={{ color: "#BFDBFE",  textAlign: "center", textDecoration: "underline", cursor: "pointer",  }} onClick={() => navigate("/login")}>
  Déjà un compte ? Connecte-toi
</p>
        <Input
          label="Pseudo"
          value={pseudo}
          onChange={(event) => setPseudo(event.target.value)}
        />
        <Input
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Age"
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />

        <Bouton style={{marginTop: "25px"}} label="Créer" onClick={handleSubmit} />
      </div>
    </div>
  );
}
