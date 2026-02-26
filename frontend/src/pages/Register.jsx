import React from "react";
import { apiPost, setToken } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      setLoading(true);
      const res = await apiPost("/auth/register", { name, email, password });
      setToken(res.token);
      nav("/");
    } catch (e2) {
      setErr(e2?.error || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2>Register</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (6+ chars)" type="password" />
        <button type="submit">{loading ? "Creating..." : "Create account"}</button>
        {err ? <div style={{ color: "#ffb4b4", fontWeight: 800 }}>{err}</div> : null}
      </form>
      <div style={{ marginTop: 10 }}>
        Already have account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}