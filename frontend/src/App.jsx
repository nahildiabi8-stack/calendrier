import { Routes, Route } from "react-router-dom";
import MonCalendrier from "./components/Calender/Calender";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/Login";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/calender" element={<MonCalendrier  />} />
    </Routes>
  );
}
