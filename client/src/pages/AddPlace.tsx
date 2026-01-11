import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Amenity {
  id: string;
  name: string;
  description: string;
}

export default function AddPlace({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    fetch("http://localhost:4000/api/v1/amenities")
      .then(res => res.json())
      .then(setAmenities);
  }, []);

  function handleAmenityChange(id: string) {
    setSelectedAmenities(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const newPlace = {
      title,
      description,
      price: parseFloat(price),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      amenities: selectedAmenities
    };
    const res = await fetch("http://localhost:4000/api/v1/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newPlace)
    });
    if (res.ok) {
      const place = await res.json();
      if (photos.length > 0) {
        const formData = new FormData();
        photos.forEach(file => formData.append("photos", file));
        await fetch(`http://localhost:4000/api/v1/places/${place.id}/photos`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        } as any);
      }
      alert("Place created!");
      onBack();
    } else {
      alert("Error creating place");
    }
    setSaving(false);
  }

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
      <h2 style={{ marginTop: 2, fontSize: "1.7rem", fontWeight: 700 }}>Create new place</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 9, fontWeight: 600 }}>
          Title:
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: "100%", marginTop: 4, marginBottom: 13, padding: 8, borderRadius: 7, border: "1px solid #d9e2ee" }}
            required
          />
        </label>
        <label style={{ display: "block", marginBottom: 13, fontWeight: 600 }}>
          Description:
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 7, border: "1px solid #d9e2ee" }}
            rows={3}
            required
          />
        </label>
        <label style={{ display: "inline-block", marginBottom: 13, fontWeight: 600, marginRight:12 }}>
          Price:
          <input
            type="number"
            value={price}
            min={0}
            step={0.01}
            onChange={e => setPrice(e.target.value)}
            style={{ width: 110, marginLeft: 8, padding: 6, borderRadius: 7, border: "1px solid #d9e2ee" }}
            required
          />
        </label>
        <label style={{ display: "inline-block", marginRight: 12 }}>
          Lat:
          <input
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
            style={{ width: 90, marginLeft: 6, padding: 6, borderRadius: 7, border: "1px solid #d9e2ee" }}
            required
          />
        </label>
        <label style={{ display: "inline-block" }}>
          Lon:
          <input
            value={longitude}
            onChange={e => setLongitude(e.target.value)}
            style={{ width: 90, marginLeft: 6, padding: 6, borderRadius: 7, border: "1px solid #d9e2ee" }}
            required
          />
        </label>

        {/* Amenities */}
        <div style={{ margin: "20px 0 18px 0" }}>
          <b style={{ fontSize: "1.08em" }}>Select amenities:</b>
          <div style={{ marginTop: 12, marginBottom: 8, display: "flex", flexWrap: "wrap", gap: 13 }}>
            {amenities.length === 0 && <span style={{ color: "#aaa" }}>No amenities available</span>}
            {amenities.map(a => (
              <label key={a.id} style={{
                background: "#f8fbff",
                border: "1.5px solid #cbe0fe",
                borderRadius: 8,
                padding: "6px 12px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer"
              }}>
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(a.id)}
                  value={a.id}
                  onChange={() => handleAmenityChange(a.id)}
                  style={{ marginRight: 7 }}
                />
                {a.name}
              </label>
            ))}
          </div>
        </div>
        {/* Photos */}
        <div style={{ margin: "16px 0 22px 0" }}>
          <b>Photos:</b>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => setPhotos(e.target.files ? Array.from(e.target.files) : [])}
            style={{ display: "block", marginTop: 9, marginBottom: 10, fontSize: "1.1em" }}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          style={{
            background: "linear-gradient(90deg, #3650f7 0%, #6dccff 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 33px",
            fontWeight: 700,
            fontSize: "1.07em",
            marginTop: "13px",
            cursor: "pointer",
            boxShadow: "0 3px 16px #3650f724"
          }}>
          {saving ? "Saving..." : "Save place"}
        </button>
      </form>
    </div>
  );
}