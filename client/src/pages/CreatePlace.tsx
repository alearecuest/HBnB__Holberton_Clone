import React, { useState } from "react";
import { createPlace } from "../api/places";
import { useAuth } from "../context/AuthContext";

export default function CreatePlace({ onCreated }: { onCreated: () => void }) {
  const { token } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", price: 0, latitude: 0, longitude: 0 });
  const [error, setError] = useState<string | null>(null);

  if (!token) return <div>Debes iniciar sesión para crear un lugar.</div>;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "price" || name === "latitude" || name === "longitude" ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createPlace(form, token);
      setError(null);
      setForm({ title: "", description: "", price: 0, latitude: 0, longitude: 0 });
      onCreated(); // <- aquí avisas al padre que refresque el listado
    } catch (err: any) {
      setError(err.message || "Error al crear lugar");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: "auto", marginTop: 30 }}>
      <h2>Crear lugar</h2>
      <input name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
      <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />
      <input name="price" placeholder="Precio" type="number" value={form.price} onChange={handleChange} required />
      <input name="latitude" placeholder="Latitud" type="number" value={form.latitude} onChange={handleChange} required />
      <input name="longitude" placeholder="Longitud" type="number" value={form.longitude} onChange={handleChange} required />
      <button type="submit">Crear lugar</button>
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
}