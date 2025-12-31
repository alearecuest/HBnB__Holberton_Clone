import React, { useState } from "react";
import { createPlace } from "../api/places";
import { useAuth } from "../context/AuthContext";

export default function CreatePlace({ onCreated }: { onCreated: () => void }) {
  const { token } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", price: "", latitude: "", longitude: "" });
  const [error, setError] = useState<string | null>(null);

  if (!token) return <div>You need to be logged in to create a place.</div>;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createPlace({
        ...form,
        price: Number(form.price),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      }, token);
      setError(null);
      setForm({ title: "", description: "", price: "", latitude: "", longitude: "" });
      onCreated();
    } catch (err: any) {
      setError(err.message || "Error creating place");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: "auto", marginTop: 30 }}>
      <h2>Create place</h2>

      <label htmlFor="title" style={{ fontWeight: 500, marginBottom: 3 }}>Title</label>
      <input
        id="title"
        name="title"
        placeholder="e.g. Cozy Loft Downtown"
        value={form.title}
        onChange={handleChange}
        required
      />

      <label htmlFor="description" style={{ fontWeight: 500, marginBottom: 3 }}>Description</label>
      <input
        id="description"
        name="description"
        placeholder="e.g. 2 bedrooms, kitchen, bathroom"
        value={form.description}
        onChange={handleChange}
        required
      />

      <label htmlFor="price" style={{ fontWeight: 500, marginBottom: 3 }}>Price</label>
      <input
        id="price"
        name="price"
        type="number"
        placeholder="e.g. U$S 50 per day"
        value={form.price}
        onChange={handleChange}
        required
      />

      <label htmlFor="latitude" style={{ fontWeight: 500, marginBottom: 3 }}>Latitude</label>
      <input
        id="latitude"
        name="latitude"
        type="number"
        placeholder="e.g. -34.6037"
        value={form.latitude}
        onChange={handleChange}
        required
      />

      <label htmlFor="longitude" style={{ fontWeight: 500, marginBottom: 3 }}>Longitude</label>
      <input
        id="longitude"
        name="longitude"
        type="number"
        placeholder="e.g. -58.3816"
        value={form.longitude}
        onChange={handleChange}
        required
      />

      <button type="submit">Create place</button>
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
}