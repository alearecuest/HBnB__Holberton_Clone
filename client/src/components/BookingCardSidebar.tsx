import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function BookingCardSidebar({
  price,
  onReserve,
}: {
  price: number;
  onReserve: (details: { dates: any; guests: number }) => void;
}) {
  const { t, i18n } = useTranslation();
  const [guests, setGuests] = useState(1);
  const [dateIn, setDateIn] = useState("");
  const [dateOut, setDateOut] = useState("");

  const showPrice = price ? `$${price} USD` : "--";

  const labelCheckIn = i18n.language === "es" ? "Entrada" : t("booking.checkin", "Check in");
  const labelCheckOut = i18n.language === "es" ? "Salida" : t("booking.checkout", "Check out");
  const labelGuests = i18n.language === "es" ? "Huéspedes" : t("booking.guests", "Guests");
  const btnReserve = i18n.language === "es" ? "Reservar" : t("booking.reserve", "Reserve");
  const labelNoPay = i18n.language === "es"
    ? "No se te cobrará aún"
    : t("booking.nopay", "You won't be charged yet");

  const phCheckIn = i18n.language === "es"
    ? "dd/mm/aaaa"
    : t("booking.checkin_placeholder", "dd/mm/yyyy");
  const phCheckOut = i18n.language === "es"
    ? "dd/mm/aaaa"
    : t("booking.checkout_placeholder", "dd/mm/yyyy");

  return (
    <div style={{
      width: 350,
      maxWidth: "98vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 18px 23px 18px",
      margin: "auto"
    }}>
      <div style={{
        fontSize: "1.52em",
        fontWeight: 700,
        color: "#223e58",
        marginBottom: 17,
        textAlign: "center"
      }}>
        {showPrice}
        <span style={{ fontWeight: 400, fontSize: "0.98em", color: "#887" }}>
          / {i18n.language === "es" ? "noche" : t("booking.night", "night")}
        </span>
      </div>
      <form style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
      }}>
        <label style={{ width: "100%", fontWeight: 600, marginBottom: 5, textAlign: "center" }}>
          {labelCheckIn}
          <input
            type="date"
            value={dateIn}
            onChange={e => setDateIn(e.target.value)}
            placeholder={phCheckIn}
            style={{
              margin: "7px auto 11px auto",
              padding: 8,
              borderRadius: 7,
              border: "1px solid #dde",
              width: "96%",
              display: "block",
              fontSize: "1.07em"
            }}
          />
        </label>
        <label style={{ width: "100%", fontWeight: 600, marginBottom: 5, textAlign: "center" }}>
          {labelCheckOut}
          <input
            type="date"
            value={dateOut}
            onChange={e => setDateOut(e.target.value)}
            placeholder={phCheckOut}
            style={{
              margin: "7px auto 11px auto",
              padding: 8,
              borderRadius: 7,
              border: "1px solid #dde",
              width: "96%",
              display: "block",
              fontSize: "1.07em"
            }}
          />
        </label>
        <label style={{ width: "100%", fontWeight: 600, marginBottom: 14, textAlign: "center" }}>
          {labelGuests}
          <input
            type="number"
            min={1}
            max={8}
            value={guests}
            onChange={e => setGuests(Number(e.target.value))}
            style={{
              width: 64,
              margin: "7px auto 0 auto",
              padding: 8,
              borderRadius: 7,
              border: "1px solid #dde",
              fontSize: "1.07em",
              display: "block"
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => onReserve({ dates: { in: dateIn, out: dateOut }, guests })}
          className="vibrant-btn"
          style={{
            width: "92%",
            padding: "13px 0",
            borderRadius: 10,
            marginBottom: 7,
            fontSize: "1.12em",
            margin: "12px auto 0 auto",
            fontWeight: 900,
            height: "44px"
          }}
          disabled={!dateIn || !dateOut}
        >
          {btnReserve}
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: 12, width: "100%" }}>
        <span style={{ fontSize: ".97em", color: "#788", width: "100%", display: "block" }}>
          {labelNoPay}
        </span>
      </div>
    </div>
  );
}