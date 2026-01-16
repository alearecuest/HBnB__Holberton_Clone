import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Places from "./pages/Places";
import CreatePlace from "./pages/CreatePlace";
import PlaceDetail from "./pages/PlaceDetail";
import EditPlace from "./pages/EditPlace";
import { useAuth } from "./context/AuthContext";
import "./App.css";

export default function App() {
  const { token } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <Navbar
        onLoginClick={() => navigate("/login")}
        onRegisterClick={() => navigate("/register")}
        onMenuClick={() => {}}
      />
      <Routes>
        <Route path="/" element={<Places />} />
        <Route path="/login" element={<Login onSuccess={() => navigate("/")} />} />
        <Route path="/register" element={<Register onSuccess={() => navigate("/login")} />} />
        <Route
          path="/create"
          element={
            token ? <CreatePlace onCreated={() => navigate("/")} /> : <Login onSuccess={() => navigate("/create")} />
          }
        />
        <Route path="/places/:id" element={<PlaceDetail />} />
        <Route path="/places/:id/edit" element={<EditPlace />} />
      </Routes>
    </div>
  );
}