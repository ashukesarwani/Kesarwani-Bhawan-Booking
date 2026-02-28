import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost, setToken, setUser } from "../api";

export default function Register() {
  const nav = useNavigate();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(e) {
    e.preventDefault();

    const n = name.trim();
    const em = email.trim().toLowerCase();
    const ph = phone.trim();
    const pw = password;

    if (!n || !em || !ph || !pw) {
      setErr("All fields required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setErr("Enter a valid email");
      return;
    }
    // India phone basic check (10+ digits)
    if (!/^\d{10,15}$/.test(ph.replace(/\s+/g, ""))) {
      setErr("Enter a valid phone number");
      return;
    }
    if (pw.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const res = await apiPost("/auth/register", {
        name: n,
        email: em,
        phone: ph,
        password: pw,
      });

      if (res?.token) setToken(res.token);
      if (res?.user) setUser(res.user);

      nav("/");
    } catch (e2) {
      setErr(e2?.error || e2?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2>Register</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (WhatsApp)" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (6+ chars)" type="password" />

        <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? "Creating..." : "Create account"}
        </button>

        {err ? <div style={{ color: "#ffb4b4", fontWeight: 800 }}>{err}</div> : null}
      </form>

      <div style={{ marginTop: 10 }}>
        Already have account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}