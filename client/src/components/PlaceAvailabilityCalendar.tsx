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
  const [busyRanges, setBusyRanges] = useState<{ from: string, to: string }[]>([]);
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null);
  const [msg, setMsg] = useState<string>("");
  const [error, setError] = useState<string>("");

  function fetchBusy() {
    fetch(`http://localhost:4000/api/v1/places/${placeId}/reservations`)
      .then(res => res.json())
      .then(setBusyRanges)
      .catch(() => setBusyRanges([]));
  }
  useEffect(() => { fetchBusy(); }, [placeId]);

  function isDateBusy(date: Date) {
    return busyRanges.some(r => {
      const start = new Date(r.from);
      const end = new Date(r.to);
      return (date >= start && date <= end);
    });
  }

  function tileDisabled({ date, view }: any) {
    if (view === 'month' && isDateBusy(date)) return true;
    return false;
  }

  function tileClassName({ date, view }: any) {
    if (view === 'month' && isDateBusy(date)) {
      return 'busy-day';
    }
    return null;
  }

  function onOwnerSelect(range: [Date, Date]) {
    setSelectedRange(range);
    setMsg(""); setError("");
    if (Array.isArray(range) && range[0] && range[1]) {
      const {from, to} = rangeToApi(range);
      fetch(`http://localhost:4000/api/v1/places/${placeId}/blockdates`, {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          ...(token ? {Authorization: `Bearer ${token}`} : {})
        },
        body: JSON.stringify({ from, to })
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to block days");
        return res.json();
      })
      .then(() => {
        setMsg(i18nLanguage === "es"
          ? "¡Días bloqueados correctamente!"
          : "Days blocked successfully!");
        fetchBusy();
        setSelectedRange(null);
      }).catch(() => {
        setError(i18nLanguage === "es"
          ? "Error bloqueando días"
          : "Failed to block days");
      });
    }
  }

  function onGuestSelect(range: [Date, Date]) {
    setSelectedRange(range);
    setMsg(""); setError("");
    if (Array.isArray(range) && range[0] && range[1]) {
      const {from, to} = rangeToApi(range);
      let d = new Date(from);
      const end = new Date(to);
      let free = true;
      while (d <= end) {
        if (isDateBusy(d)) {
          free = false;
          break;
        }
        d.setDate(d.getDate() + 1);
      }
      if (!free) {
        setError(i18nLanguage === "es"
          ? "¡No se pueden reservar días ocupados!"
          : "Cannot reserve busy days!");
        return;
      }
      fetch(`http://localhost:4000/api/v1/places/${placeId}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          ...(token ? {Authorization: `Bearer ${token}`} : {})
        },
        body: JSON.stringify({ from, to })
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to reserve");
        return res.json();
      })
      .then(() => {
        setMsg(i18nLanguage === "es"
            ? "¡Reserva realizada con éxito!"
            : "Reservation successful!");
        fetchBusy();
        setSelectedRange(null);
      }).catch(() => {
        setError(i18nLanguage === "es"
            ? "Ocurrió un error en la reserva"
            : "Error making reservation");
      });
    }
  }

  return (
    <div style={{
      margin: "2.5em 0",
      minWidth: 425,
      maxWidth: 540,
      width: "95%",
      padding: "16px 18px 14px 18px",
      background: "#fff",
      borderRadius: 18,
      border: "1.5px solid #c9d3e7"
    }}>
      <div style={{ fontWeight: 800, fontSize: "1.11rem", marginBottom: 11 }}>
        {i18nLanguage === "es" ? "Calendario de disponibilidad" : "Availability calendar"}
      </div>
      <Calendar
        locale={i18nLanguage === "es" ? "es-ES" : "en-US"}
        selectRange={true}
        onChange={isOwner ? onOwnerSelect : onGuestSelect}
        tileClassName={tileClassName}
        tileDisabled={tileDisabled}
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
        }
        .react-calendar__navigation {
          margin-bottom: 8px !important;
        }
        .react-calendar__navigation button {
          background: none;
          color: #3650f7;
          font-weight: bold;
          font-size: 1.18em;
          border-radius: 6px;
          border: none;
          outline: none;
          transition: background .15s;
        }
        .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus {
          background: #e6f0fe;
          color: #1f43bb;
        }
        .react-calendar__navigation button[disabled] {
          opacity: 0.33;
        }
        .react-calendar__tile {
          font-weight: 500;
        }
        .busy-day {
          background: #ffdede !important;
          color: #ce1818 !important;
          opacity: 1 !important;
          border-radius: 50%;
          font-weight: bold;
          border: 2px solid #fdf0f0;
        }
        .react-calendar__tile--active {
          background: #3650f7 !important;
          color: #fff !important;
        }
        .react-calendar__month-view__weekdays {
          color: #1550bb;
          font-weight: 700;
        }
        .react-calendar__tile--now {
          background: #fff8 !important;
          color: #1887ce !important;
          font-weight: 700;
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
            ? "Selecciona un rango de días libres para reservar."
            : "Select a range of available days to reserve."}
        </div>
      )}
    </div>
  );
}