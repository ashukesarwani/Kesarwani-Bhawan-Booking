import React from "react";

const PLACEHOLDER_IMAGES = [
  { id: 1, title: "Front View", note: "Replace later with real bhawan photo" },
  { id: 2, title: "Room View", note: "Replace later with room photos" },
  { id: 3, title: "Reception", note: "Replace later" },
  { id: 4, title: "Washroom", note: "Replace later" },
];

export default function Gallery() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h2 style={{ margin: 0 }}>Gallery</h2>
      <p style={{ marginTop: 0, opacity: 0.85 }}>
        Temporary placeholders हैं — आप बाद में photos replace कर सकते हो.
      </p>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {PLACEHOLDER_IMAGES.map((x) => (
          <div
            key={x.id}
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 160,
                background:
                  "linear-gradient(135deg, rgba(110,231,255,0.18), rgba(255,255,255,0.02))",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
              }}
            >
              PHOTO
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 900 }}>{x.title}</div>
              <div style={{ opacity: 0.75, marginTop: 4, fontSize: 13 }}>{x.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}