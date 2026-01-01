import React from "react";

export default function PhotoGalleryModal({ photos, open, onClose }: { photos: any[], open: boolean, onClose: ()=>void }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(33,44,44,0.66)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 19,
          maxWidth: 950,
          maxHeight: 700,
          width: "85vw",
          boxShadow: "0 7px 33px #3b96f9aa",
          padding: 32,
          overflow: "auto",
          position: "relative"
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{
          position: "absolute", top: 18, right: 28, background: "none",
          border: "none", fontSize: 36, color: "#444", cursor: "pointer"
        }}>&times;</button>
        <div style={{display: "flex", flexWrap:"wrap", gap: "16px"}}>
          {photos.map((photo,i) => (
            <img
              key={i}
              src={`http://localhost:4000${photo.url}`}
              alt={`Gallery ${i+1}`}
              style={{width: "260px", height: "185px", objectFit: "cover", borderRadius: 10, border: "1px solid #eef" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}