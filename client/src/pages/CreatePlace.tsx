import React, { useState, useRef } from "react";
import { createPlace } from "../api/places";
import { useAuth } from "../context/AuthContext";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const place = await createPlace({
        ...form,
        price: Number(form.price),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
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
          cursor: "copy",
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              {photos.map((photo, idx) => (
                <div key={idx} style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Preview"
                    style={{ width: 68, height: 68, objectFit: "cover", borderRadius: 6, border: "1px solid #ccd" }}
                  />
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleRemovePhoto(idx); }}
                    style={{
                      position: "absolute", top: -10, right: -10,
                      border: "none", background: "#e32", color: "#fff", borderRadius: "50%",
                      width: 20, height: 20, cursor: "pointer"
                    }}
                    title="Remove photo"
                  >&times;</button>
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