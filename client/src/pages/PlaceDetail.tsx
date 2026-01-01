import React, { useEffect, useState } from "react";
import Reviews from "../components/Reviews";

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

function GalleryGrid({ photos }: { photos: any[] }) {
  if (!photos || photos.length === 0) {
    return (
      <div style={{
        padding: 32,
        background: "#f1f4fa",
        borderRadius: 18,
        minHeight: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 18px #0002",
        fontWeight: 600,
        color: "#667",
        letterSpacing: "0.5px"
      }}>
        <span role="img" aria-label="No photo" style={{fontSize:"3em", marginRight:15}}></span>
        No photos added yet. Be the first to upload!
      </div>
    );
  }
  if (photos.length === 1) {
    return (
      <div style={{
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 3px 22px #acc7fe27",
        margin: "18px 0 30px 0"
      }}>
        <img src={`http://localhost:4000${photos[0].url}`} alt="Place" style={{
          width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 18
        }}/>
      </div>
    );
  }
  if (photos.length === 2) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: "10px",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 3px 22px #acc7fe27",
        margin: "18px 0 30px 0"
      }}>
        <img src={`http://localhost:4000${photos[0].url}`} alt="Main" style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: "18px 0 0 18px" }}/>
        <img src={`http://localhost:4000${photos[1].url}`} alt="Second" style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: "0 18px 18px 0" }}/>
      </div>
    );
  }
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1.8fr 1fr",
      gap: "8px",
      borderRadius: "18px",
      overflow: "hidden",
      minHeight: "300px",
      boxShadow: "0 3px 22px #acc7fe27",
      margin: "18px 0 30px 0",
      position: "relative"
    }}>
      {/* Main photo large */}
      <div style={{ gridRow: "1 / span 2", position: "relative", overflow: "hidden" }}>
        <img
          src={`http://localhost:4000${photos[0].url}`}
          alt="Main place"
          style={{
            width: "100%",
            height: "100%",
            maxHeight: "420px",
            objectFit: "cover",
            borderRadius: "15px 0 0 15px"
          }}
        />
      </div>
      {/* Grid of up to 4 more */}
      <div style={{
        display: "grid",
        gridTemplateRows: "1fr 1fr",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px"
      }}>
        {photos.slice(1, 5).map((photo, i) => (
          <div key={i} style={{
            width: "100%",
            height: "140px",
            overflow: "hidden",
            borderRadius:
              i === 0 ? "0 15px 0 0" :
              i === 1 ? "0 0 0 0" :
              i === 2 ? "0 0 15px 0" :
              i === 3 ? "0 0 0 0" : 0,
            position: "relative"
          }}>
            <img
              src={`http://localhost:4000${photo.url}`}
              alt={`Gallery ${i + 2}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "inherit"
              }}
            />
          </div>
        ))}
      </div>
      {/* Show all photos button */}
      {photos.length > 5 && (
        <button
          onClick={() => alert("Coming soon: lightbox/full gallery")}
          style={{
            position: "absolute",
            bottom: "18px",
            right: "20px",
            padding: "10px 20px",
            borderRadius: "14px",
            border: "none",
            background: "#fff",
            color: "#223",
            fontWeight: "700",
            boxShadow: "0 2px 8px #aaa9",
            cursor: "pointer",
            zIndex: 2
          }}
        >Show all photos</button>
      )}
    </div>
  );
}

export default function PlaceDetail({ id, onBack }: { id: string, onBack: () => void }) {
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:4000/api/v1/places/${id}`)
      .then(res => res.json())
      .then(data => {
        setPlace(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!place) return <div>Not found</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "2rem auto", fontFamily: "Montserrat, Arial, sans-serif" }}>
      <button onClick={onBack} style={{ marginBottom: 18, background: "#eee", border: "none", padding: "8px 16px", borderRadius: 7, cursor: "pointer", fontSize:"1rem" }}>← Back to places</button>
      <h2 style={{ marginTop: 6, fontSize: "2rem", fontWeight: 700, letterSpacing: "-1.5px" }}>{place.title}</h2>
      <GalleryGrid photos={place.photos || []} />
      <div style={{ color: "#7a7a7a", marginBottom: 13, fontSize: "1.11rem" }}>{place.description}</div>
      <div style={{ fontSize: "1.18rem", margin: "10px 0 25px 0", color: "#2a446e" }}>
        <b>Price: </b>{formatPrice(place.price)}
        <span style={{ marginLeft: 18 }}><b>Latitude:</b> {place.latitude}, <b>Longitude:</b> {place.longitude}</span>
      </div>
      <Reviews placeId={place.id} />
    </div>
  );
}