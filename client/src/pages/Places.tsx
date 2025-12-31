import React from "react";
import Reviews from "../components/Reviews";

interface Place {
  id: string;
  title: string;
  description: string;
  price: number;
}

export default function Places({ places, loading }: { places: Place[]; loading: boolean }) {
  if (loading) return <div>Loading...</div>;
  if (!places || places.length === 0) return <div>No places available yet.</div>;
  return (
    <div>
      <h2>Places</h2>
      <ul>
        {places.map(place => (
          <li key={place.id} style={{ marginBottom: 32 }}>
            <strong>{place.title}</strong> — {place.description} ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(place.price)})
            <Reviews placeId={place.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}