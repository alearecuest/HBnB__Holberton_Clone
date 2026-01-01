import React, { useState } from "react";
import Navbar from "./components/Navbar";
import HamburgerMenu from "./components/HamburgerMenu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Places from "./pages/Places";
import CreatePlace from "./pages/CreatePlace";
import PlaceDetail from "./pages/PlaceDetail";
import { fetchPlaces } from "./api/places";
import { useAuth } from "./context/AuthContext";
import "./App.css";

type Page = "places" | "create" | { detail: string };

export default function App() {
  const { token, user, logout } = useAuth();
  const [page, setPage] = useState<Page>("places");
  const [places, setPlaces] = useState<any[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState<boolean>(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  React.useEffect(() => {
    loadPlaces();
  }, []);

  function handleCreatedPlace() {
    setPage("places");
    loadPlaces();
  }

  function goToDetail(id: string) {
    setPage({ detail: id });
  }

  function handleNav(page: string) {
    setPage(page as Page);
    setShowMenu(false);
  }

  return (
    <>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onMenuClick={() => setShowMenu(true)}
      />
      <HamburgerMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        onNav={handleNav}
        isLoggedIn={!!token}
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
        onLogout={logout}
        user={user}
      />
      <nav style={{
        textAlign: 'center',
        margin: 12,
        display: window.innerWidth < 850 ? "none" : "block"
      }}>
        <button onClick={() => setPage("places")}>Places</button>
        <button onClick={() => token ? setPage("create") : setShowLogin(true)}>Create place</button>
      </nav>
      {page === "places" && <Places places={places} loading={loadingPlaces} onDetail={goToDetail} />}
      {page === "create" && token && <CreatePlace onCreated={handleCreatedPlace} />}
      {page === "create" && !token && (
        <div style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 6px 24px #aaf7fe20",
          padding: 38,
          textAlign: "center",
          maxWidth: 420,
          margin: "40px auto"
        }}>
          <p style={{ fontSize: "1.2rem" }}>You need to be logged in to create a place.</p>
          <button onClick={() => setShowLogin(true)}>Login</button>
        </div>
      )}
      {typeof page === "object" && "detail" in page && (
        <PlaceDetail id={page.detail} onBack={() => setPage("places")} />
      )}
      {showLogin && (
        <Modal onClose={() => setShowLogin(false)}>
          <Login onSuccess={() => setShowLogin(false)} />
        </Modal>
      )}
      {showRegister && (
        <Modal onClose={() => setShowRegister(false)}>
          <Register onSuccess={() => setShowRegister(false)} />
        </Modal>
      )}
    </>
  );
}

function Modal({ children, onClose }: { children: any, onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(34,54,73,0.16)", zIndex: 99, display: "flex", alignItems: "center", justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div style={{ background: "#fff", borderRadius: 19, minWidth: 350, minHeight: 120, boxShadow: "0 4px 44px #3b96f966", padding: 32, position: "relative" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: "absolute", top: 10, right: 16, border: "none", background: "none", fontSize: 22, color: "#555", cursor: "pointer"
        }}>&times;</button>
        {children}
      </div>
    </div>
  );
}