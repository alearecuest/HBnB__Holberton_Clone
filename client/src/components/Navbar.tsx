import { useAuth } from "../context/AuthContext";
import logo from "/logo.png";

export default function Navbar({ onLoginClick, onRegisterClick, onMenuClick }: {
  onLoginClick: () => void,
  onRegisterClick: () => void,
  onMenuClick: () => void
}) {
  const { token, user, logout } = useAuth();
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 24, margin: "22px 20px", position: "relative" }}>
      <img
        src={logo} alt="HBnB logo" width={120} height={40} style={{ marginRight: 26, marginLeft: 4, cursor: "pointer" }}
        onClick={() => window.location.href = "/"}
        title="Ir a inicio"
      />
      <div style={{
        marginLeft: "auto",
        display: window.innerWidth < 850 ? "none" : "block"
      }}>
        {!token ? (
          <>
            <button onClick={onLoginClick}>Login</button>
            <button onClick={onRegisterClick}>Register</button>
          </>
        ) : (
          <>
            <span style={{ marginRight: 12 }}>Hello, {user?.firstName || user?.email}!</span>
            <button onClick={logout}>Sign out</button>
          </>
        )}
      </div>
      {/* Burger appears only in mobile */}
      <div style={{
        position: "absolute",
        right: 12,
        top: 11,
        display: window.innerWidth >= 850 ? "none" : "block"
      }}>
        <button
          onClick={onMenuClick}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: 27,
            cursor: "pointer"
          }}
          aria-label="Open menu"
        >
          <span style={{
            display: "block", width: 32, height: 4, background: "#5279c8", borderRadius: "7px", marginBottom: "7px"
          }}></span>
          <span style={{
            display: "block", width: 32, height: 4, background: "#5279c8", borderRadius: "7px", marginBottom: "7px"
          }}></span>
          <span style={{
            display: "block", width: 32, height: 4, background: "#5279c8", borderRadius: "7px"
          }}></span>
        </button>
      </div>
    </nav>
  );
}