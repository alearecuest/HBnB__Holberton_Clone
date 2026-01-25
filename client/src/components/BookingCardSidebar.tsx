import React, { useState } from "react";

export default function BookingCardSidebar({
  price,
  onReserve,
}: {
  price: number;
  onReserve: (details: { dates: any; guests: number }) => void;
}) {
  const [guests, setGuests] = useState(1);
  const [dateIn, setDateIn] = useState("");
  const [dateOut, setDateOut] = useState("");

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
        {price ? `$${price} USD` : "--"} <span style={{fontWeight:400, fontSize:"0.98em", color:"#887"}}>/ night</span>
      </div>
      <form style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
      }}>
        <label style={{ width: "100%", fontWeight: 600, marginBottom: 5, textAlign: "center" }}>
          Check in
          <input
            type="date"
            value={dateIn}
            onChange={e => setDateIn(e.target.value)}
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
          Check out
          <input
            type="date"
            value={dateOut}
            onChange={e => setDateOut(e.target.value)}
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
          Guests
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
            fontWeight: 900
          }}
          disabled={!dateIn || !dateOut}
        >Reserve</button>
      </form>
      <div style={{textAlign:"center", marginTop:12, width:'100%'}}>
        <span style={{fontSize:".97em", color:"#788", width:'100%', display:'block'}}>You won't be charged yet</span>
      </div>
    </div>
  );
}