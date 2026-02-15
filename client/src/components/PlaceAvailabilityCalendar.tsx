import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

function rangeToApi(range: [Date, Date]) {
  const sort = range[0] < range[1] ? range : [range[1], range[0]];
  return {
    from: sort[0].toISOString().slice(0,10),
    to: sort[1].toISOString().slice(0,10),
  };
}

export default function PlaceAvailabilityCalendar({
  placeId,
  isOwner = false,
  i18nLanguage = "en",
  token
}: {
  placeId: string;
  isOwner?: boolean;
  i18nLanguage?: string;
  token?: string;
}) {
  const [busyDates, setBusyDates] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null);
  const [msg, setMsg] = useState<string>("");
  const [error, setError] = useState<string>("");

  function fetchBusy() {
    fetch(`http://localhost:4000/api/v1/places/${placeId}/availabilities`)
      .then(res => res.json())
      .then(arr => {
        const onlyDates = arr.map((a: any) => (a.date.length > 10 ? a.date.slice(0,10) : a.date));
        setBusyDates(onlyDates);
      })
      .catch(() => setBusyDates([]));
  }

  useEffect(() => { fetchBusy(); setSelectedRange(null); }, [placeId, isOwner]);

  function isDateBusy(date: Date) {
    return busyDates.includes(date.toISOString().slice(0,10));
  }

  function tileClassName({ date, view }: any) {
    if (view === 'month' && isDateBusy(date)) {
      return 'busy-day';
    }
    return null;
  }

  async function onOwnerSelect(range: [Date, Date]) {
    setSelectedRange(range);
    setMsg(""); setError("");
    if (Array.isArray(range) && range[0] && range[1]) {
      const {from, to} = rangeToApi(range);
      let d = new Date(from), end = new Date(to);
      while (d <= end) {
        if (isDateBusy(d)) {
          setError(i18nLanguage === "es"
            ? "No puedes bloquear días ya ocupados."
            : "Cannot block days already busy.");
          return;
        }
        d.setDate(d.getDate() + 1);
      }
      try {
        const res = await fetch(`http://localhost:4000/api/v1/places/${placeId}/blockdates`, {
          method: "POST",
          headers: {
            "Content-Type":"application/json",
            ...(token ? {Authorization: `Bearer ${token}`} : {})
          },
          body: JSON.stringify({ from, to })
        });
        if (!res.ok) throw new Error();
        setMsg(i18nLanguage === "es"
          ? "¡Días bloqueados correctamente!"
          : "Days blocked successfully!");
        fetchBusy();
        setSelectedRange(null);
      } catch {
        setError(i18nLanguage === "es"
          ? "Error bloqueando días"
          : "Failed to block days");
      }
    }
  }

  return (
    <div style={{
      margin: "2.5em 0",
      minWidth: 270,
      maxWidth: 540,
      width: "95%",
      padding: "16px 18px 14px 18px",
      background: "#fff",
      borderRadius: 18,
      border: "1.5px solid #c9d3e7"
    }}>
      <div style={{ fontWeight: 800, fontSize: "1.09rem", marginBottom: 11 }}>
        {i18nLanguage === "es" ? "Calendario de disponibilidad" : "Availability calendar"}
      </div>
      <Calendar
        locale={i18nLanguage === "es" ? "es-ES" : "en-US"}
        selectRange={isOwner}
        onChange={isOwner ? onOwnerSelect : undefined}
        tileClassName={tileClassName}
        tileContent={({ date, view }) =>
          view === 'month' && isDateBusy(date) ? (
          <span className="busy-emoji" role="img" aria-label="blocked">🚫</span>
        ) : null
        }
        minDetail="month"
        maxDetail="month"
        value={selectedRange ? selectedRange : undefined}
        className="custom-hbnb-calendar"
      />
      <style>{`
        .custom-hbnb-calendar {
          border: none;
          box-shadow: 0 3px 18px #acc7fe17;
          font-size: 1.14rem;
          width: 100%;
          margin: 0 auto;
        }
        .busy-day {
          background: #ffdede !important;
          color: #ce1818 !important;
          opacity: 1 !important;
          border-radius: 50% !important;
          font-weight: bold !important;
          border: 2px solid #fdf0f0 !important;
          box-shadow: 0 0 0 4px #ffe8e8 !important;
        }
      `}</style>
      {(msg || error) &&
        <div style={{
          margin: "14px 0 0",
          fontWeight: 600,
          color: error ? "#b31b15" : "#095",
          background: error ? "#ffd3d3" : "#e2ffd3",
          border: "1px solid #f3eaea",
          padding: "7px 15px",
          borderRadius: 9
        }}>
          {msg || error}
        </div>
      }
      {isOwner ? (
        <div style={{ fontSize: 13, marginTop: 6, color: "#477", fontWeight: 500 }}>
          {i18nLanguage === "es"
            ? "Selecciona un rango para bloquearlo. No se puede desbloquear una vez creado."
            : "Select a range to block. Can't unblock once created."}
        </div>
      ) : (
        <div style={{ fontSize: 13, marginTop: 6, color: "#557", fontWeight: 500 }}>
          {i18nLanguage === "es"
            ? "Días en rojo: ocupados/no disponibles. Sólo el anfitrión puede modificar el calendario."
            : "Red days: unavailable/busy. Only the host can modify the calendar."}
        </div>
      )}
    </div>
  );
}