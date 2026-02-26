import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { apiGet } from "../api";

function toKey(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export default function AvailabilityCalendar({ onSelectRange }) {
  const [blockedSet, setBlockedSet] = React.useState(new Set());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const blocks = await apiGet("/blocks");
        setBlockedSet(new Set(blocks.map((b) => toKey(b.date))));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function tileDisabled({ date, view }) {
    if (view !== "month") return false;
    return blockedSet.has(toKey(date));
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 900 }}>Availability Calendar</div>
      {loading ? (
        <div style={{ opacity: 0.75 }}>Loading…</div>
      ) : (
        <Calendar selectRange tileDisabled={tileDisabled} onChange={onSelectRange} />
      )}
      <div style={{ fontSize: 12, opacity: 0.75 }}>
        Blocked dates disabled हैं (booking नहीं होगी).
      </div>
    </div>
  );
}