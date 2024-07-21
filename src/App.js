import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/register/:token" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
