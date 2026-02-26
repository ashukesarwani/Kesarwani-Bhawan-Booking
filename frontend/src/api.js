export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

/* ---------------- TOKEN HELPERS ---------------- */

export function setToken(token) {
  if (token) {
    localStorage.setItem("TOKEN", token);
  } else {
    localStorage.removeItem("TOKEN");
  }
}

export function getToken() {
  return localStorage.getItem("TOKEN");
}

export function setUser(user) {
  if (user) localStorage.setItem("USER", JSON.stringify(user));
  else localStorage.removeItem("USER");
}

export function getUser() {
  const raw = localStorage.getItem("USER");
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  setToken(null);
  setUser(null);
}

/* ---------------- INTERNAL PARSER ---------------- */

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

/* ---------------- REQUEST HELPERS ---------------- */

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ---------------- API METHODS ---------------- */

export function apiGet(path, opts = {}) {
  return fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      ...authHeader(),
      ...(opts.headers || {}),
    },
  }).then(parse);
}

export function apiPost(path, body, opts = {}) {
  return fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(opts.headers || {}),
    },
    body: JSON.stringify(body),
  }).then(parse);
}

export function apiPatch(path, body, opts = {}) {
  return fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(opts.headers || {}),
    },
    body: JSON.stringify(body),
  }).then(parse);
}

export function apiDelete(path, opts = {}) {
  return fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
      ...(opts.headers || {}),
    },
  }).then(parse);
}