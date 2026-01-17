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
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "24px 36px 18px 36px"
    }}>
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
          title="Go to home"
        />
        <button
          className="navbar-btn"
          onClick={() => navigate("/")}
        >
          {t("navbar.places")}
        </button>
        <button
          className="navbar-btn"
          onClick={() => navigate("/create")}
        >
          {t("navbar.create")}
        </button>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
      }}>
        <select
          className="navbar-lang-select"
          value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value)}
          aria-label="Select language"
        >
          {languages.map(lan => (
            <option value={lan.code} key={lan.code}>{lan.label}</option>
          ))}
        </select>
        {!token ? (
          <>
            <button
              className="navbar-btn"
              onClick={onLoginClick}
            >
              {t("navbar.login")}
            </button>
            <button
              className="navbar-btn"
              onClick={onRegisterClick}
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
              className="navbar-btn"
              onClick={logout}
            >
              {t("navbar.signout")}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}