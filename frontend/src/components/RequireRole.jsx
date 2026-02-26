import React from "react";
import { getUser } from "../api";

export default function RequireRole({ role, children }) {
  const user = getUser();
  if (!user) {
    window.location.href = "/login";
    return null;
  }
  if (user.role !== role) {
    return <div style={{ padding: 20, fontWeight: 900 }}>Access denied</div>;
  }
  return children;
}