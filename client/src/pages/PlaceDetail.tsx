import React, { useEffect, useState } from "react";
import Reviews from "../components/Reviews";

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

export default function PlaceDetail({ id, onBack }: { id: string, onBack: () => void }) {
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:4000/api/v1/places`)
      .then(res => res.json())
      .then(data => {
        const p = data.find((pl: any) => pl.id === id);
        setPlace(p);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!place) return <div>Not found</div>;

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "Montserrat, Arial, sans-serif" }}>
      <button onClick={onBack} style={{ marginBottom: 14, background: "#eee", border: "none", padding: "8px 16px", borderRadius: 7, cursor: "pointer" }}>← Back to places</button>
      <h2 style={{ marginTop: 16 }}>{place.title}</h2>
      <div style={{ color: "#7a7a7a", marginBottom: 10 }}>{place.description}</div>
      <div><b>Price:</b> {formatPrice(place.price)}</div>
      <div><b>Latitude:</b> {place.latitude}, <b>Longitude:</b> {place.longitude}</div>
      <div style={{ margin: "24px 0" }}>
        <h4>Photos</h4>
        {place.photos && place.photos.length > 0 ? (
          <div style={{
            display: "flex", gap: 10, flexWrap: "wrap",
            background: "#f5f7fa", borderRadius: 8, padding: 12
          }}>
            {place.photos.map((photo: any, i: number) => (
              <img key={i} src={`http://localhost:4000${photo.url}`} alt="place"
                style={{ width: 130, height: 90, objectFit: "cover", borderRadius: 6 }} />
            ))}
          </div>
        ) : (
          <div>No photos for this place yet.</div>
        )}
      </div>
      <Reviews placeId={place.id} />
    </div>
  );
}