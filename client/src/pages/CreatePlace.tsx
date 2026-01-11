import React, { useEffect, useState, useRef } from "react";
import { createPlace } from "../api/places";
import { useAuth } from "../context/AuthContext";

interface Amenity {
  id: string;
  name: string;
  description: string;
}

function arrayfyFiles(fileList: FileList | null): File[] {
  if (!fileList) return [];
  return Array.from(fileList);
}

export default function CreatePlace({ onCreated }: { onCreated: () => void }) {
  const { token } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", price: "", latitude: "", longitude: "" });
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Amenities state
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/v1/amenities")
      .then(res => res.json())
      .then(setAmenities);
  }, []);

  if (!token) return <div>You need to be logged in to create a place.</div>;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotos(arrayfyFiles(e.target.files));
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files) setPhotos(arrayfyFiles(e.dataTransfer.files));
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleRemovePhoto(idx: number) {
    setPhotos(old => old.filter((_, i) => i !== idx));
  }

  function handleAmenityChange(id: string) {
    setSelectedAmenities(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    if (!form.title.trim())
      return setError("Title is required.");
    if (!form.description.trim())
      return setError("Description is required.");
    if (!form.price)
      return setError("Price is required.");
    if (photos.length < 1)
      return setError("At least one photo is required.");
    try {
      const place = await createPlace({
        ...form,
        price: Number(form.price),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        amenities: selectedAmenities
      }, token);

      if (photos.length && place.id) {
        const formData = new FormData();
        photos.forEach(photo => formData.append("photos", photo));
        const res = await fetch(`http://localhost:4000/api/v1/places/${place.id}/photos`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error uploading photo(s)");
        }
      }
      setError(null);
      setForm({ title: "", description: "", price: "", latitude: "", longitude: "" });
      setSelectedAmenities([]);
      setPhotos([]);
      onCreated();
    } catch (err: any) {
      setError(err.message || "Error creating place");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 410, margin: "auto", marginTop: 30 }}>
      <h2>Create place</h2>
      <label htmlFor="title" style={{ fontWeight: 500 }}>Title</label>
      <input id="title" name="title" placeholder="e.g. Cozy Loft Downtown" value={form.title} onChange={handleChange} required />

      <label htmlFor="description" style={{ fontWeight: 500 }}>Description</label>
      <input id="description" name="description" placeholder="e.g. 2 bedrooms, kitchen, bathroom" value={form.description} onChange={handleChange} required />

      <label htmlFor="price" style={{ fontWeight: 500 }}>Price</label>
      <input id="price" name="price" type="number" placeholder="e.g. U$S 50 per day" value={form.price} onChange={handleChange} required />

      <label htmlFor="latitude" style={{ fontWeight: 500 }}>Latitude</label>
      <input id="latitude" name="latitude" type="number" placeholder="e.g. -34.6037" value={form.latitude} onChange={handleChange} required />

      <label htmlFor="longitude" style={{ fontWeight: 500 }}>Longitude</label>
      <input id="longitude" name="longitude" type="number" placeholder="e.g. -58.3816" value={form.longitude} onChange={handleChange} required />

      {/* Amenities section */}
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
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #87a5f8",
          borderRadius: 7,
          padding: 18,
          margin: "16px 0",
          background: "#f9fbff",
          textAlign: "center",
          cursor: "copy"
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
        {photos.length === 0
          ? <span>Drag and drop photos here, or <u>click to select</u>.</span>
          : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              {photos.map((photo, idx) => (
                <div key={idx} style={{
                  position: "relative",
                  width: 78,
                  height: 78,
                  margin: "6px 0",
                  borderRadius: 11,
                  overflow: "hidden",
                  background: "#fff",
                  border: "1.5px solid #b6cdfa",
                  boxShadow: "0 1px 5px #cce2ff36",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 9 }}
                  />
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleRemovePhoto(idx); }}
                    style={{
                      all: "unset",
                      boxSizing: "border-box",
                      position: "absolute",
                      top: 5,
                      right: 5,
                      width: 22,
                      height: 22,
                      background: "#e53",
                      color: "#fff",
                      borderRadius: "50%",
                      fontWeight: "900",
                      fontSize: 15,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 2,
                      margin: 0,
                      lineHeight: "22px",
                      border: "none",
                      boxShadow: "0 2px 4px #0002"
                    }}
                    title="Remove photo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </div>
      <button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create place"}</button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
}