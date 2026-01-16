import React, { useState } from "react";
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

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 0",
        background: "rgba(255,255,255,0.88)",
        margin: "0 auto 28px auto",
        borderRadius: 16,
        boxShadow: "0 4px 24px #aac7fa19",
        maxWidth: 990,
      }}
    >
      <input
        type="text"
        placeholder={t("search.location", "Where to?")}
        value={location}
        onChange={e => setLocation(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "1.4px solid #b8c0da",
          minWidth: 150,
          fontSize: "1rem"
        }}
      />

      <input
        type="date"
        placeholder={t("search.from", "From")}
        value={from}
        onChange={e => setFrom(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: 8,
          border: "1.4px solid #b8c0da",
          minWidth: 110,
          fontSize: "1rem"
        }}
      />

      <input
        type="date"
        placeholder={t("search.to", "To")}
        value={to}
        onChange={e => setTo(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: 8,
          border: "1.4px solid #b8c0da",
          minWidth: 110,
          fontSize: "1rem"
        }}
      />

      <input
        type="number"
        min={1}
        max={20}
        value={guests}
        onChange={e => setGuests(Number(e.target.value))}
        style={{
          padding: "10px",
          borderRadius: 8,
          border: "1.4px solid #b8c0da",
          width: "75px",
          fontSize: "1rem"
        }}
        placeholder={t("search.guests", "Guests")}
      />

      <button
        style={{
          background: "#264ef7",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1rem",
          border: "none",
          borderRadius: 10,
          padding: "10px 26px",
          cursor: "pointer",
          marginLeft: 10,
          boxShadow: "0 3px 13px #aac7",
        }}
        onClick={() => onSearch({
          location,
          dateRange: { from, to },
          guests
        })}
      >
        {t("search.search", "Search")}
      </button>
    </div>
  );
}