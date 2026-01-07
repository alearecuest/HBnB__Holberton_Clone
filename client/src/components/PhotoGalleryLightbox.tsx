import React, { useEffect } from "react";

type Props = {
  open: boolean;
  photos: { url: string }[];
  title?: string;
  onClose: () => void;
  initialIndex?: number;
};

export default function PhotoGalleryLightbox({ open, photos, title, onClose, initialIndex = 0 }: Props) {
  const [idx, setIdx] = React.useState(initialIndex);

  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && idx > 0) setIdx(i => i - 1);
      if (e.key === "ArrowRight" && idx < photos.length - 1) setIdx(i => i + 1);
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, idx, photos.length]);

  useEffect(() => {
    setIdx(initialIndex);
  }, [open, initialIndex]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(34,54,73,0.95)", zIndex: 999,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 40, right: 50, color: "#fff", fontSize: 42, border: "none",
          background: "none", cursor: "pointer", zIndex: 1005, fontWeight: 900, lineHeight: "1.1"
        }}
        aria-label="Close photos"
      >×</button>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: "90vw", maxHeight: "86vh", width: 720, background: "none", position: "relative", display: "flex", flexDirection: "column", alignItems: "center"
        }}
      >
        {title &&
          <div style={{ color: "#fff", fontSize: 22, marginBottom: 13, fontWeight: 700, textAlign: "center" }}>
            {title}
          </div>}
        <div style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}>
          {/* Left Arrow */}
          <button
            onClick={() => setIdx(i => Math.max(0, i - 1))}
            disabled={idx === 0}
            style={{
              background: "rgba(50,50,70,0.34)",
              border: "none",
              color: "#fff",
              fontSize: 36,
              padding: 12,
              borderRadius: "50%",
              position: "absolute",
              left: -54,
              cursor: idx === 0 ? "not-allowed" : "pointer",
              opacity: idx === 0 ? 0.25 : 1,
              zIndex: 2
            }}
          >&lt;</button>
          {/* The Photograf */}
          <img
            src={`http://localhost:4000${photos[idx].url}`}
            alt={`Property gallery ${idx + 1}`}
            style={{
              maxWidth: "82vw",
              maxHeight: "64vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              borderRadius: 14,
              boxShadow: "0 8px 36px #0003",
              background: "#fff"
            }}
          />
          {/* Right Arrow */}
          <button
            onClick={() => setIdx(i => Math.min(photos.length - 1, i + 1))}
            disabled={idx === photos.length - 1}
            style={{
              background: "rgba(50,50,70,0.34)",
              border: "none",
              color: "#fff",
              fontSize: 36,
              padding: 12,
              borderRadius: "50%",
              position: "absolute",
              right: -54,
              cursor: idx === photos.length - 1 ? "not-allowed" : "pointer",
              opacity: idx === photos.length - 1 ? 0.25 : 1,
              zIndex: 2
            }}
          >&gt;</button>
        </div>
        <div style={{
          color: "#fff",
          textShadow: "0 2px 14px #0008",
          fontSize: "1.15em",
          marginTop: 16,
          textAlign: "center"
        }}>
          Photo {idx + 1} of {photos.length}
        </div>
      </div>
    </div>
  );
}