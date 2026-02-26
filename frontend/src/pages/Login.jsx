import React from "react";
import { apiPost, setToken, setUser } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      setLoading(true);

      const res = await apiPost("/auth/login", { email, password });

      // ✅ Save token
      setToken(res.token);

      // ✅ Save user (VERY IMPORTANT)
      setUser(res.user);

      nav("/");
    } catch (e2) {
      setErr(e2?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2>Login</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />

        <button type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>

        {err ? (
          <div style={{ color: "#ffb4b4", fontWeight: 800 }}>
            {err}
          </div>
        ) : null}
      </form>

      <div style={{ marginTop: 10 }}>
        New user? <Link to="/register">Register</Link>
      </div>

      <div style={{ marginTop: 6 }}>
        <Link to="/forgot-password">Forgot Password (OTP)</Link>
      </div>
    </div>
  );
}