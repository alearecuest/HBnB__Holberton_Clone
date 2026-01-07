import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

export default function EditPlace({ id, onBack }: { id: string, onBack: () => void }) {
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, token } = useAuth();

  useEffect(() => {
    fetch(`http://localhost:4000/api/v1/places/${id}`)
      .then(res => res.json())
      .then(data => {
        setPlace(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch place");
        setLoading(false);
      });
  }, [id]);

  const isOwner = user && place && place.owner && user.id === place.owner.id;

  async function handleDeletePhoto(idx: number) {
    if (!window.confirm("Delete this photo?")) return;
    const res = await fetch(`http://localhost:4000/api/v1/places/${place.id}/photos/${idx}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const updated = await fetch(`http://localhost:4000/api/v1/places/${place.id}`).then(r => r.json());
      setPlace(updated);
    } else {
      alert("Error deleting photo.");
    }
  }

  async function handleDeletePlace() {
    if (!window.confirm("Delete this place forever?")) return;
    const res = await fetch(`http://localhost:4000/api/v1/places/${place.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      alert("Place deleted!");
      onBack();
    } else {
      alert("Error deleting place.");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!place) return <div>{error || "Not found"}</div>;

  return (
    <div style={{
      maxWidth: 650,
      margin: "2rem auto",
      background: "#fff",
      borderRadius: 18,
      boxShadow: "0 6px 28px #4b7ade18",
      padding: 32,
      fontFamily: "Montserrat, Arial, sans-serif"
    }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: 16, background: "#eef1f5", border: "none", padding: "8px 18px", borderRadius: 7, cursor: "pointer", fontSize: "1rem"
        }}
      >← Back</button>
      <h2 style={{ marginTop: 2, fontSize: "1.7rem", fontWeight: 700 }}>{place.title}</h2>
      <div style={{ color: "#7a7a7a", margin: "10px 0 19px 0" }}>{place.description}</div>
      <div style={{ marginBottom: "26px" }}>
        <b>Price:</b> {formatPrice(place.price)}<br />
        <b>Lat:</b> {place.latitude} <b>Lon:</b> {place.longitude}
      </div>
      <div style={{ marginBottom: "26px" }}>
        <div style={{
          marginBottom: 10,
          fontWeight: 500,
          fontSize: "1.13em"
        }}>Photos:</div>
        <div style={{
          display: "flex", gap: 13, flexWrap: "wrap",
          border: "2px dashed #d4e4ff", borderRadius: 14, padding: 16,
          background: "#f8fbff"
        }}>
          {place.photos && place.photos.length > 0 ? place.photos.map((photo: any, idx: number) => (
            <div key={photo.id || idx} style={{
              position: "relative",
              width: 110,
              height: 75,
              borderRadius: 13,
              overflow: "hidden",
              background: "#fff"
            }}>
              <img src={`http://localhost:4000${photo.url}`} alt="foto"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
              />
              {isOwner && (
                <button
                  onClick={() => handleDeletePhoto(idx)}
                  style={{
                    position: "absolute", top: 7, right: 7, background: "#e53", color: "#fff",
                    border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 15, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 2px 6px #0003"
                  }}
                  title="Delete photo"
                >×</button>
              )}
            </div>
          )) : <span style={{ color: "#bbb" }}>No photos.</span>}
        </div>
      </div>
      {/* Other editable fields could go here */}
      {isOwner && (
        <button
          onClick={handleDeletePlace}
          style={{
            background: "linear-gradient(90deg, #f43 0%, #e54 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "11px 30px",
            fontWeight: 700,
            fontSize: "1em",
            marginTop: "36px",
            marginBottom: "10px",
            cursor: "pointer",
            boxShadow: "0 3px 16px #fa667526"
          }}>
          Delete place
        </button>
      )}
    </div>
  );
}