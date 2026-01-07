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
    <div style={{ width: 340, maxWidth: "90vw" }}>
      <div style={{ fontSize: "1.55em", fontWeight: 700, color: "#223e58", marginBottom: 9 }}>
        {price ? `$${price} USD` : "--"} <span style={{fontWeight:400, fontSize:"0.9em", color:"#887"}}>/ night</span>
      </div>
      <div style={{ margin: "7px 0" }}>
        <label>Check in&nbsp;</label>
        <input
          type="date"
          value={dateIn}
          onChange={e => setDateIn(e.target.value)}
          style={{ marginBottom:7, padding:5, borderRadius:5, border:"1px solid #dde" }} 
        />
      </div>
      <div style={{ margin: "7px 0" }}>
        <label>Check out&nbsp;</label>
        <input
          type="date"
          value={dateOut}
          onChange={e => setDateOut(e.target.value)}
          style={{ padding:5, borderRadius:5, border:"1px solid #dde" }} 
        />
      </div>
      <div style={{ margin: "13px 0 16px 0" }}>
        <label>Guests&nbsp;</label>
        <input
          type="number"
          min={1}
          max={8}
          value={guests}
          onChange={e => setGuests(Number(e.target.value))}
          style={{ width: 50, padding:5, borderRadius:5, border:"1px solid #dde", marginLeft:5 }} 
        />
      </div>
      <button
        type="button"
        onClick={() => onReserve({ dates: { in: dateIn, out: dateOut }, guests })}
        className="vibrant-btn"
        style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: 10,
          marginBottom: 5,
          fontSize: "1.13em",
        }}
        disabled={!dateIn || !dateOut}
      >Reserve</button>
      <div style={{textAlign:"center", marginTop:14}}>
        <span style={{fontSize:".93em", color:"#788"}}>You won't be charged yet</span>
      </div>
    </div>
  );
}