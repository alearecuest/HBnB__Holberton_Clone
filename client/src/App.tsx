import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Places from "./pages/Places";
// Add these imports only if these components exist:
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
      {/* Example nav. Improve as needed. */}
      <nav style={{ margin: "16px", textAlign: "center" }}>
        <button onClick={() => navigate("/")}>Places</button>
        <button onClick={() => navigate("/create")}>Create Place</button>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </nav>
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