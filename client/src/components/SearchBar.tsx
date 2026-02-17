import { useState } from "react";
import { useTranslation } from "react-i18next";

type SearchBarProps = {
  onSearch: (params: { location: string; dateRange: { from: string, to: string }; guests: number }) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState(1);

  const isMobile = window.innerWidth < 700;

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSearch({ location, dateRange: { from, to }, guests }); }}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 13 : 18,
        alignItems: isMobile ? "stretch" : "flex-end",
        justifyContent: isMobile ? "stretch" : "center",
        padding: "20px 0",
        background: "rgba(255,255,255,0.88)",
        margin: "0 auto 28px auto",
        borderRadius: 16,
        boxShadow: "0 4px 24px #aac7fa19",
        maxWidth: 990,
      }}
    >
      <div style={{display: "flex", flexDirection:"column", alignItems:"flex-start", width: isMobile ? "100%" : "auto"}}>
        <label htmlFor="search-location">{t("search.location", "Where to?")}</label>
        <input
          id="search-location"
          type="text"
          placeholder={t("search.location", "Where to?")}
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={{
            fontSize: "1rem",
            height: "42px",
            width: isMobile ? "100%" : "140px",
            marginBottom: isMobile ? 6 : 0
          }}
        />
      </div>
      <div style={{display: "flex", flexDirection:"column", alignItems:"flex-start", width: isMobile ? "100%" : "auto"}}>
        <label htmlFor="search-from">{t("search.from", "From")}</label>
        <input
          id="search-from"
          type="date"
          value={from}
          onChange={e => setFrom(e.target.value)}
          style={{
            fontSize: "1rem",
            height: "42px",
            width: isMobile ? "100%" : "120px",
            marginBottom: isMobile ? 6 : 0
          }}
        />
      </div>
      <div style={{display: "flex", flexDirection:"column", alignItems:"flex-start", width: isMobile ? "100%" : "auto"}}>
        <label htmlFor="search-to">{t("search.to", "To")}</label>
        <input
          id="search-to"
          type="date"
          value={to}
          onChange={e => setTo(e.target.value)}
          style={{
            fontSize: "1rem",
            height: "42px",
            width: isMobile ? "100%" : "120px",
            marginBottom: isMobile ? 6 : 0
          }}
        />
      </div>
      <div style={{display: "flex", flexDirection:"column", alignItems:"flex-start", width: isMobile ? "100%" : "auto"}}>
        <label htmlFor="search-guests">{t("search.guests", "Guests")}</label>
        <input
          id="search-guests"
          type="number"
          min={1}
          max={20}
          value={guests}
          onChange={e => setGuests(Number(e.target.value))}
          style={{
            fontSize: "1rem",
            height: "42px",
            width: isMobile ? "100%" : "70px",
            marginBottom: isMobile ? 10 : 0
          }}
        />
      </div>
      <button
        className="search-btn"
        style={{
          height:"44px",
          fontWeight:700,
          fontSize: "1.09em",
          marginTop:isMobile?10:0,
          minWidth:isMobile?"100%":120,
          alignSelf:isMobile?"stretch":"flex-end"
        }}
        type="submit"
      >
        {t("search.search", "Search")}
      </button>
    </form>
  );
}