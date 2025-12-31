import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Places from "./pages/Places";
import CreatePlace from "./pages/CreatePlace";
import { fetchPlaces } from "./api/places";
import "./App.css";

type Page = "login" | "register" | "places" | "create";

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [places, setPlaces] = useState<any[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState<boolean>(false);

  async function loadPlaces() {
    setLoadingPlaces(true);
    try {
      const data = await fetchPlaces();
      setPlaces(data);
    } catch (e) {
      setPlaces([]);
    }
    setLoadingPlaces(false);
  }

  useEffect(() => {
    if (page === "places") loadPlaces();
  }, [page]);

  function handleCreatedPlace() {
    setPage("places");
    loadPlaces();
  }

  return (
    <>
      <Navbar />
      <nav style={{ textAlign: 'center', margin: 12 }}>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("register")}>Register</button>
        <button onClick={() => setPage("places")}>Places</button>
        <button onClick={() => setPage("create")}>Create place</button>
      </nav>
      {page === "login" && <Login />}
      {page === "register" && <Register />}
      {page === "places" && <Places places={places} loading={loadingPlaces} />}
      {page === "create" && <CreatePlace onCreated={handleCreatedPlace} />}
    </>
  );
}