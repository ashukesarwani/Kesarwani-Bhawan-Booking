import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

import { apiPost, getUser, logout as doLogout } from "./api";
import AvailabilityCalendar from "./components/AvailabilityCalendar";

import Admin from "./pages/Admin";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Register from "./pages/Register";

import prayagiImg from "./assets/prayagi-ashutosh.png";
import bg from "./assets/bg.jpg";
import logo from "./assets/logo.png";

const WHATSAPP_NUMBER = "917380785853";
const PROPERTY_NAME = "Kesarwani Bhawan's";
const CITY = "Prayagraj, UP";

const LOCATION_1_NAME = "Kesarwani Bhawan – Civil Lines";
const LOCATION_1_MAP = "https://www.google.com/maps?q=Kesarwani+Bhawan+Civil+Lines+Prayagraj";
const LOCATION_2_NAME = "Kesarwani Bhawan – Near Station";
const LOCATION_2_MAP = "https://www.google.com/maps?q=Kesarwani+Bhawan+Near+Station+Prayagraj";

const ROOMS = [
  { id: 1, name: "Standard Room", price: 999, info: "Best for 1–2 guests" },
  { id: 2, name: "Deluxe Room", price: 1499, info: "More space + comfort" },
  { id: 3, name: "Family Room", price: 1999, info: "Best for family stay" },
];

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ---------- UI Helpers ---------- */

function Container({ children }) {
  return <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>{children}</div>;
}

function Card({ children, style }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(10px)",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 12px 45px rgba(0,0,0,0.25)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Button({ children, href, onClick, variant = "primary" }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 900,
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.12)",
    cursor: "pointer",
    userSelect: "none",
    transition: "transform 120ms ease",
  };

  const styles =
    variant === "primary"
      ? { background: "linear-gradient(135deg, #60a5fa, #22c55e)", color: "#06101f" }
      : variant === "ghost"
      ? { background: "rgba(255,255,255,0.06)", color: "#e8edf7" }
      : variant === "whatsapp"
      ? { background: "#25D366", color: "#0b1220" }
      : { background: "transparent", color: "#e8edf7" };

  const common = { ...base, ...styles };

  if (href) return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={common}>{children}</a>;
  return (
    <button
      onClick={onClick}
      style={common}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

function NavPill({ to, children }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: active ? "#06101f" : "rgba(232,237,247,0.92)",
        background: active ? "linear-gradient(135deg, #6ee7ff, #a7f3d0)" : "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        padding: "8px 12px",
        borderRadius: 999,
        fontWeight: 900,
        fontSize: 14,
      }}
    >
      {children}
    </Link>
  );
}

/* ---------- Layout ---------- */

function Layout({ children }) {
  const user = getUser();
  const msg = `Hi, I want to book a room at ${PROPERTY_NAME} (${CITY}).`;

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#e8edf7",
        fontFamily: "system-ui, Segoe UI, Arial",
        backgroundImage: `linear-gradient(rgba(7,12,24,0.70), rgba(7,12,24,0.90)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(7,12,24,0.55)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Container>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", gap: 12, flexWrap: "wrap" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "white" }}>
              <img src={logo} alt="logo" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} />
              <div style={{ display: "grid", lineHeight: 1.05 }}>
                <span style={{ fontWeight: 1000, fontSize: 16 }}>{PROPERTY_NAME}</span>
                <span style={{ opacity: 0.75, fontWeight: 700, fontSize: 12 }}>{CITY}</span>
              </div>
            </Link>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <NavPill to="/">Home</NavPill>
              <NavPill to="/rooms">Rooms</NavPill>
              <NavPill to="/booking">Booking</NavPill>
              <NavPill to="/gallery">Gallery</NavPill>

              {!user ? (
                <>
                  <NavPill to="/login">Login</NavPill>
                  <NavPill to="/register">Register</NavPill>
                </>
              ) : (
                <>
                  <span style={{ fontWeight: 900, opacity: 0.9 }}>Hi, {user.name}</span>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      doLogout();
                      window.location.href = "/login";
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}

              <Button variant="whatsapp" href={whatsappLink(msg)}>
                WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* MAIN */}
      <Container>
        <div style={{ padding: "22px 0 40px" }}>{children}</div>
      </Container>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", background: "rgba(7,12,24,0.60)", backdropFilter: "blur(12px)", padding: "22px 0" }}>
        <Container>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
            <div>
              <div style={{ fontWeight: 1000, fontSize: 16 }}>{PROPERTY_NAME}</div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>{CITY}</div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>© {new Date().getFullYear()} {PROPERTY_NAME}. All rights reserved.</div>
            </div>

            <div>
              <div style={{ fontWeight: 1000, fontSize: 16 }}>Contact</div>
              <div style={{ opacity: 0.85, marginTop: 6 }}>Phone/WhatsApp: {WHATSAPP_NUMBER}</div>
              <div style={{ opacity: 0.85, marginTop: 6 }}>Email: yourmail@example.com</div>
            </div>

            <div>
              <div style={{ fontWeight: 1000, fontSize: 16 }}>Locations</div>
              <a href={LOCATION_1_MAP} target="_blank" rel="noreferrer" style={{ display: "block", marginTop: 8, color: "rgba(232,237,247,0.9)", textDecoration: "none" }}>
                📍 {LOCATION_1_NAME}
              </a>
              <a href={LOCATION_2_MAP} target="_blank" rel="noreferrer" style={{ display: "block", marginTop: 8, color: "rgba(232,237,247,0.9)", textDecoration: "none" }}>
                📍 {LOCATION_2_NAME}
              </a>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

/* ---------- Pages ---------- */

function Home() {
  return (
    <div style={{ display: "grid", gap: 16, placeItems: "center" }}>
      <Card style={{ width: "min(920px, 100%)" }}>
        <div style={{ display: "grid", gap: 10, textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 40, letterSpacing: 0.2 }}>{PROPERTY_NAME}</h1>
          <div style={{ opacity: 0.85, fontWeight: 700 }}>Comfortable rooms in {CITY}. Booking details save होंगे + admin confirm करेगा.</div>

          <div style={{ display: "grid", placeItems: "center", marginTop: 8 }}>
            <div
              style={{
                width: "min(520px, 92vw)",
                borderRadius: 20,
                padding: 14,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <img
                src={prayagiImg}
                alt="Prayagi Ashutosh"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: 16,
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <Button variant="ghost" href="/rooms">See Rooms</Button>
            <Button variant="primary" href="/booking">Book Now</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Rooms() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h2 style={{ margin: "0 0 6px" }}>Rooms & Pricing</h2>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {ROOMS.map((r) => (
          <Card key={r.id}>
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 1000, fontSize: 18 }}>{r.name}</div>
              <div style={{ opacity: 0.9 }}>
                <span style={{ fontWeight: 1000, fontSize: 22 }}>₹{r.price}</span> <span style={{ opacity: 0.8 }}>/ night</span>
              </div>
              <div style={{ opacity: 0.8 }}>{r.info}</div>
              <div style={{ marginTop: 10 }}>
                <Button variant="primary" href={`/booking?room=${encodeURIComponent(r.name)}`}>Request Booking</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Booking() {
  const user = getUser();

  // protect
  React.useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  const params = new URLSearchParams(window.location.search);
  const defaultRoom = params.get("room") || "";

  const [form, setForm] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    checkin: "",
    checkout: "",
    guests: "2",
    room: defaultRoom,
    notes: "",
  });

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submitBooking() {
    setError("");
    try {
      setSaving(true);
      await apiPost("/bookings", { ...form, guests: Number(form.guests || 2) });
      alert("Booking submitted! Admin will confirm soon.");
      window.location.href = "/rooms";
    } catch (e) {
      setError(e?.error || "Booking failed");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div style={{ display: "grid", gap: 14, maxWidth: 900 }}>
      <h2 style={{ margin: 0 }}>Booking Request</h2>

      <Card>
        <AvailabilityCalendar
          onSelectRange={(range) => {
            if (Array.isArray(range) && range[0] && range[1]) {
              update("checkin", new Date(range[0]).toISOString().slice(0, 10));
              update("checkout", new Date(range[1]).toISOString().slice(0, 10));
            }
          }}
        />
      </Card>

      <Card>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Field label="Full Name"><input value={form.name} onChange={(e) => update("name", e.target.value)} /></Field>
          <Field label="Email"><input value={form.email} onChange={(e) => update("email", e.target.value)} /></Field>
          <Field label="Phone (WhatsApp)"><input value={form.phone} onChange={(e) => update("phone", e.target.value)} /></Field>

          <Field label="Room Type">
            <select value={form.room} onChange={(e) => update("room", e.target.value)}>
              <option value="">Select room</option>
              {ROOMS.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </Field>

          <Field label="Guests">
            <select value={form.guests} onChange={(e) => update("guests", e.target.value)}>
              {["1","2","3","4","5","6"].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>

          <Field label="Check-in Date"><input type="date" value={form.checkin} onChange={(e) => update("checkin", e.target.value)} /></Field>
          <Field label="Check-out Date"><input type="date" value={form.checkout} onChange={(e) => update("checkout", e.target.value)} /></Field>
        </div>

        <div style={{ marginTop: 10 }}>
          <Field label="Notes (optional)"><textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} /></Field>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <Button variant="primary" onClick={submitBooking}>{saving ? "Saving..." : "Submit Booking"}</Button>
        </div>

        {error ? <div style={{ color: "#ffb4b4", fontWeight: 1000, marginTop: 10 }}>{error}</div> : null}
      </Card>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 6, fontWeight: 900, color: "rgba(232,237,247,0.95)" }}>
      <span style={{ fontSize: 13, opacity: 0.9 }}>{label}</span>
      {React.cloneElement(children, {
        style: {
          width: "100%",
          background: "rgba(255,255,255,0.06)",
          color: "#e8edf7",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
          padding: "10px 12px",
          outline: "none",
        },
      })}
    </label>
  );
}

/* ---------- App ---------- */

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin-ashu-2026" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}