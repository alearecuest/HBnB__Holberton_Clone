import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Places from "./pages/Places";

type Page = "login" | "register" | "places";

function App() {
  const [page, setPage] = useState<Page>("login");

  return (
    <>
      <Navbar />
      <nav style={{ textAlign: 'center', margin: 12 }}>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("register")}>Registrarse</button>
        <button onClick={() => setPage("places")}>Lugares</button>
      </nav>
      {page === "login" && <Login />}
      {page === "register" && <Register />}
      {page === "places" && <Places />}
    </>
  );
}

export default App;