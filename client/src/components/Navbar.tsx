import { useAuth } from "../context/AuthContext";
import logo from "/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar({
  onLoginClick,
  onRegisterClick,
}: {
  onLoginClick: () => void,
  onRegisterClick: () => void,
}) {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <nav className="navbar-hbnb">
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <img
          src={logo}
          alt="HBnB logo"
          height={40}
          style={{
            cursor: "pointer",
            marginRight: 12,
            marginLeft: 4,
            objectFit: "contain",
            display: "block"
          }}
          onClick={() => navigate("/")}
          title={i18n.language === "es" ? "Ir a la página principal" : "Go to home"}
        />
        <button
          className="navbar-btn"
          onClick={() => navigate("/")}
        >
          {i18n.language === "es" ? "Propiedades" : t("navbar.places")}
        </button>
        <button
          className="navbar-btn"
          onClick={() => navigate("/create")}
        >
          {i18n.language === "es" ? "Crear" : t("navbar.create")}
        </button>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
      }}>
        <button
          className="navbar-lang-btn"
          onClick={() => i18n.changeLanguage(i18n.language === "en" ? "es" : "en")}
          title={i18n.language === "en" ? "Cambiar a Español" : "Change to English"}
        >
          <span role="img" aria-label="Idioma" style={{fontSize:"1.44em", verticalAlign:"middle"}}>🌐</span>
          <span style={{
            fontWeight: 700,
            fontSize: "0.97em",
            letterSpacing: ".5px",
            verticalAlign:"middle",
            marginLeft:7,
            marginRight:4,
            color: "#1550bb"
          }}>
            {i18n.language.toUpperCase()}
          </span>
        </button>

        {!token ? (
          <>
            <button
              className="navbar-btn"
              onClick={onLoginClick}
            >
              {i18n.language === "es" ? "Iniciar sesión" : t("navbar.login")}
            </button>
            <button
              className="navbar-btn"
              onClick={onRegisterClick}
            >
              {i18n.language === "es" ? "Registrarse" : t("navbar.register")}
            </button>
          </>
        ) : (
          <>
            <span className="navbar-username" style={{
              color: "#21335c",
              fontWeight: 900,
              marginRight: 2,
              fontSize: "1.08em"
            }}>
              {i18n.language === "es"
                ? `Hola, ${user?.firstName || user?.email}`
                : t("navbar.hello", { name: user?.firstName || user?.email })}
            </span>
            <button
              className="navbar-btn signout-btn"
              onClick={logout}
            >
              {i18n.language === "es" ? "Cerrar sesión" : t("navbar.signout")}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}