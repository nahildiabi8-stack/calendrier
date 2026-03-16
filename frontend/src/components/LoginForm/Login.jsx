import { useState, useEffect } from "react";
import Input from "../Input/Input";
import Bouton from "../Bouton/Bouton";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = () => {
    fetch("/api/process/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user_loggedin) {
          localStorage.setItem("user_id", data.user_id);
          navigate("/calender", { replace: true });
        }
      });
  };

  return (
    <div
    
      className="flex flex-column align-items-center justify-content-center gap-4 "
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      
      <div
        className="shadow-3 p-4 border-round animate-login"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          width: "400px",
        }}
      >
          <p style={{ color: "#BFDBFE",  textAlign: "center", textDecoration: "underline", cursor: "pointer",  }} onClick={() => navigate("/")}>
  Pas de compte ? Créer en un
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
      
        <Bouton style={{marginTop: "25px"}} label="Entrer"  onClick={handleSubmit} />
      </div>
    </div>
  );
}
