import React from "react";

export default function FeaturedCarousel({ places, onSelect }: { places: any[], onSelect: (id: string) => void }) {
  if (!places || places.length === 0) return null;

  return (
    <div style={{
      width: "100%",
      margin: "0 auto 30px auto",
      overflowX: "auto",
      padding: "0 0 16px 0"
    }}>
      <div style={{
        display: "flex",
        gap: 19,
        minWidth: 480,
        maxWidth: 1240,
        padding: "7px 12px"
      }}>
        {places.map((p) => (
          <div key={p.id} style={{
            minWidth: 290,
            maxWidth: 340,
            background: "#f9fbff",
            borderRadius: 15,
            boxShadow: "0 6px 20px #bdd6ff33",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column"
          }}
            onClick={() => onSelect(p.id)}
            tabIndex={0}
          >
            <div style={{
              position: "relative",
              height: 160,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              overflow: "hidden",
              background: "#dde7fa"
            }}>
              {p.photos && p.photos.length > 0 ? (
                <img src={`http://localhost:4000${p.photos[0].url}`} alt={p.title} style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }} />
              ) : (
                <span style={{ position: "absolute", left: "50%", top: "45%", transform: "translate(-50%,-50%)", color: "#7bb", fontSize: "1.8rem" }}>
                  No photo
                </span>
              )}
            </div>
            <div style={{ padding: "13px 15px 8px 15px" }}>
              <div style={{ fontWeight: 700, fontSize: "1.12rem", marginBottom: "2px" }}>{p.title}</div>
              <div style={{ color: "#4a5c77", fontSize: "1rem", marginBottom: 5 }}>{p.description}</div>
              <div style={{ color: "#21478e", fontWeight: 600, fontSize: "1.09rem" }}>${p.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}