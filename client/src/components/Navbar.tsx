import { useAuth } from "../context/AuthContext";
import logo from "/logo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar({
  onLoginClick,
  onRegisterClick,
  onMenuClick,
}: {
  onLoginClick: () => void,
  onRegisterClick: () => void,
  onMenuClick: () => void
}) {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 28px",
        background: "transparent",
        minHeight: 64,
      }}
    >
      {/* Left: Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <img
          src={logo}
          alt="HBnB logo"
          height={48}
          style={{
            cursor: "pointer",
            marginRight: 14,
            marginLeft: 4,
            objectFit: "contain",
          }}
          onClick={() => navigate("/")}
          title="Go to home"
        />
        <button
          onClick={() => navigate("/")}
          style={{
            fontWeight: 600,
            fontSize: "1rem",
            padding: "8px 18px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            borderRadius: 6,
          }}
        >
          Places
        </button>
        <button
          onClick={() => navigate("/create")}
          style={{
            fontWeight: 600,
            fontSize: "1rem",
            padding: "8px 18px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            borderRadius: 6,
          }}
        >
          Create Place
        </button>
      </div>
      {/* Right: Auth buttons or greeting */}
      <div style={{
        display: "flex",
        gap: 12,
        alignItems: "center"
      }}>
        {!token ? (
          <>
            <button
              onClick={onLoginClick}
              style={{
                fontWeight: 500,
                fontSize: ".98rem",
                padding: "8px 18px",
                border: "1.5px solid #224",
                background: "white",
                borderRadius: 7,
                cursor: "pointer"
              }}
            >
              Login
            </button>
            <button
              onClick={onRegisterClick}
              style={{
                fontWeight: 500,
                fontSize: ".98rem",
                padding: "8px 18px",
                border: "1.5px solid #224",
                background: "white",
                borderRadius: 7,
                cursor: "pointer"
              }}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <span style={{ marginRight: 2, color: "#21335c", fontWeight: 500 }}>
              Hello, {user?.firstName || user?.email}!
            </span>
            <button
              onClick={logout}
              style={{
                fontWeight: 600,
                fontSize: ".98rem",
                padding: "8px 18px",
                border: "1.5px solid #224",
                background: "white",
                borderRadius: 7,
                cursor: "pointer"
              }}
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}