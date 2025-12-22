import React, { useEffect, useState } from "react";
import { fetchPlaces } from "../api/places";

interface Place {
  id: string;
  title: string;
  description: string;
  price: number;
}

export default function Places() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchPlaces()
      .then(data => setPlaces(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div style={{color:"red"}}>{error}</div>;

  return (
    <div>
      <h2>Lugares</h2>
      {places.length === 0 && <p>No hay lugares aún.</p>}
      <ul>
        {places.map(place => (
          <li key={place.id}>
            <b>{place.title}</b> — {place.description} ($ {place.price})
          </li>
        ))}
      </ul>
    </div>
  );
}