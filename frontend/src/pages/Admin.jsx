import React from "react";
import { apiDelete, apiGet, apiPatch, apiPost } from "../api";

export default function Admin() {
  const [key, setKey] = React.useState(localStorage.getItem("ADMIN_KEY") || "");
  const [bookings, setBookings] = React.useState([]);
  const [blocks, setBlocks] = React.useState([]);
  const [blockDate, setBlockDate] = React.useState("");
  const [blockReason, setBlockReason] = React.useState("");
  const [err, setErr] = React.useState("");

  const headers = { "x-admin-key": key };

  async function loadAll() {
    setErr("");
    const [b, bl] = await Promise.all([
      apiGet("/bookings", { headers }),
      apiGet("/blocks"),
    ]);
    setBookings(b);
    setBlocks(bl);
  }

  React.useEffect(() => {
    if (key) loadAll().catch((e) => setErr(e?.error || "Admin key invalid"));
    // eslint-disable-next-line
  }, []);

  function saveKey() {
    localStorage.setItem("ADMIN_KEY", key);
    loadAll().catch((e) => setErr(e?.error || "Admin key invalid"));
  }

  async function setStatus(id, status) {
    await apiPatch(`/bookings/${id}/status`, { status }, { headers });
    await loadAll();
  }

  async function addBlock() {
    if (!blockDate) return;
    await apiPost("/blocks", { date: blockDate, reason: blockReason }, { headers });
    setBlockDate("");
    setBlockReason("");
    await loadAll();
  }

  async function removeBlock(id) {
    await apiDelete(`/blocks/${id}`, { headers });
    await loadAll();
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h2 style={{ margin: 0 }}>Admin Panel</h2>

      <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <div style={{ fontWeight: 900 }}>Admin Key</div>
        <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter ADMIN_API_KEY" style={inputStyle} />
        <button onClick={saveKey} style={btnStyle}>Save & Load</button>
        {err ? <div style={{ color: "#ffb4b4", fontWeight: 900 }}>{err}</div> : null}
      </div>

      <hr style={{ opacity: 0.15 }} />

      <div style={{ display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Date Blocking</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} style={inputStyle} />
          <input value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Reason (optional)" style={inputStyle} />
          <button onClick={addBlock} style={btnStyle}>Block Date</button>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {blocks.map((b) => (
            <div key={b._id} style={rowStyle}>
              <div>
                <b>{new Date(b.date).toISOString().slice(0, 10)}</b>
                {b.reason ? <span style={{ opacity: 0.8 }}> — {b.reason}</span> : null}
              </div>
              <button onClick={() => removeBlock(b._id)} style={btnAlt}>Unblock</button>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ opacity: 0.15 }} />

      <div style={{ display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Bookings</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {bookings.map((bk) => (
            <div key={bk._id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 900 }}>{bk.name} ({bk.phone})</div>
                  <div style={{ opacity: 0.8 }}>{bk.room} • Guests: {bk.guests}</div>
                  <div style={{ opacity: 0.8 }}>
                    {new Date(bk.checkin).toISOString().slice(0,10)} → {new Date(bk.checkout).toISOString().slice(0,10)}
                  </div>
                  {bk.notes ? <div style={{ opacity: 0.75, marginTop: 6 }}>Notes: {bk.notes}</div> : null}
                </div>

                <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                  <div><b>Status:</b> {bk.status}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => setStatus(bk._id, "confirmed")} style={btnStyle}>Confirm</button>
                    <button onClick={() => setStatus(bk._id, "cancelled")} style={btnAlt}>Cancel</button>
                    <button onClick={() => setStatus(bk._id, "pending")} style={btnAlt}>Pending</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {bookings.length === 0 ? <div style={{ opacity: 0.75 }}>No bookings yet.</div> : null}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  color: "#e8edf7",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 12,
  padding: "10px 12px",
  outline: "none",
  minWidth: 220,
};

const btnStyle = {
  padding: "10px 12px",
  borderRadius: 12,
  fontWeight: 900,
  cursor: "pointer",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "#6ee7ff",
  color: "#0b1220",
};

const btnAlt = {
  ...btnStyle,
  background: "transparent",
  color: "#e8edf7",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

const cardStyle = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};