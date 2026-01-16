import { useAuth } from "../context/AuthContext";
import logo from "/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React from "react";

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
  const { t, i18n } = useTranslation();

  const languages = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" }
  ];

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
          {t("navbar.places")}
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
          {t("navbar.create")}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Idioma (EN/ES) selector */}
        <select
          value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ccd",
            background: "#fff",
            fontWeight: 500,
            fontSize: ".98rem",
            cursor: "pointer"
          }}
          aria-label="Select language"
        >
          {languages.map(lan => (
            <option value={lan.code} key={lan.code}>{lan.label}</option>
          ))}
        </select>
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
              {t("navbar.login")}
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
              {t("navbar.register")}
            </button>
          </>
        ) : (
          <>
            <span style={{ color: "#21335c", fontWeight: 500, marginRight: 2 }}>
              {t("navbar.hello", { name: user?.firstName || user?.email })}
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
              {t("navbar.signout")}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}