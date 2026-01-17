import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function PlaceAvailabilityCalendar({
  placeId,
  isOwner = false,
  onBlockDates,
} : {
  placeId: string;
  isOwner?: boolean;
  onBlockDates?: (range: [Date, Date]) => void;
}) {
  const [busyRanges, setBusyRanges] = useState<{ from: string, to: string }[]>([]);
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/v1/places/${placeId}/reservations`)
      .then(res => res.json())
      .then(setBusyRanges)
      .catch(() => setBusyRanges([]));
  }, [placeId]);

  function isDateBusy(date: Date) {
    return busyRanges.some(r => {
      const start = new Date(r.from);
      const end = new Date(r.to);
      return date >= start && date <= end;
    });
  }

  function tileClassName({ date, view }: any) {
    if (view === 'month' && isDateBusy(date)) {
      return 'busy-day';
    }
    return null;
  }

  function handleSelect(range: any) {
    if (isOwner) {
      setSelectedRange(range);
      if (Array.isArray(range) && range[0] && range[1] && onBlockDates) {
        onBlockDates(range);
      }
    }
  }

  return (
    <div style={{ margin: "2.5em 0" }}>
      <div style={{ fontWeight: 800, fontSize: "1.11rem", marginBottom: 11 }}>
        Availability calendar
      </div>
      <Calendar
        selectRange={isOwner}
        onChange={handleSelect}
        tileClassName={tileClassName}
        minDetail="month"
        maxDetail="month"
      />
      <style>{`
        .busy-day {
          background: #b2c6da;
          color: #2a2a2a !important;
          opacity: 0.69;
          border-radius: 40%;
          position: relative;
        }
      `}</style>
      {isOwner &&
        <div style={{ fontSize: 13, marginTop: 8, color: "#477", fontWeight: 500 }}>
          Select a range to block/unblock&nbsp;
          (requires backend logic!).
        </div>
      }
    </div>
  );
}