import React from "react";

export default function Places({ places, loading, onDetail }: { places: any[], loading: boolean, onDetail?: (id: string) => void }) {
  function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }
  return (
    <div style={{ maxWidth: 800, margin: "30px auto" }}>
      <h2>Places</h2>
      {loading && <div>Loading...</div>}
      {(!places || places.length === 0) && !loading && <div>No places yet.</div>}
      <ul>
        {places.map((place) => (
          <li key={place.id}>
            <strong style={{ cursor: "pointer", color: "#285ec7" }}
              onClick={onDetail ? () => onDetail(place.id) : undefined}>
              {place.title}
            </strong>
            {` — ${place.description} (${formatPrice(place.price)})`}
          </li>
        ))}
      </ul>
    </div>
  );
}