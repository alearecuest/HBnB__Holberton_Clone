import React, { useEffect, useState, ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext";

export default function EditPlace({ id, onBack }: { id: string, onBack: () => void }) {
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [addPhotos, setAddPhotos] = useState<File[]>([]);

  const { user, token } = useAuth();

  useEffect(() => {
    fetch(`http://localhost:4000/api/v1/places/${id}`)
      .then(res => res.json())
      .then(data => {
        setPlace(data);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setPrice(data.price || 0);
        setLatitude(data.latitude?.toString() || "");
        setLongitude(data.longitude?.toString() || "");
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

  async function handleUploadPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append("photos", file));
    const res = await fetch(`http://localhost:4000/api/v1/places/${place.id}/photos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    } as any);
    if (res.ok) {
      const updated = await fetch(`http://localhost:4000/api/v1/places/${place.id}`).then(r => r.json());
      setPlace(updated);
    } else {
      alert("Could not upload photos.");
    }
    e.target.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const patch = {
      title,
      description,
      price: parseFloat(price as any),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };
    const res = await fetch(`http://localhost:4000/api/v1/places/${place.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(patch)
    });
    setSaving(false);
    if (res.ok) {
      alert("Saved!");
      const updated = await fetch(`http://localhost:4000/api/v1/places/${place.id}`).then(r => r.json());
      setPlace(updated);
    } else {
      alert("Could not save changes.");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!place) return <div>{error || "Not found"}</div>;

  const deleteBtnStyle = {
    position: "absolute",
    top: 8,
    right: 8,
    background: "#e53",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 700,
    boxShadow: "0 2px 6px #0002",
    cursor: "pointer",
    padding: 0
  };

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
      <h2 style={{ marginTop: 2, fontSize: "1.7rem", fontWeight: 700 }}>Edit publication</h2>
      <form onSubmit={handleSave}>
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
        <div style={{ margin: "14px 0 20px 0" }}>
          <b style={{fontSize:"1.07em"}}>Photos:</b>
          <div style={{
            marginTop: 10,
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
                    style={deleteBtnStyle}
                    title="Delete photo"
                  >×</button>
                )}
              </div>
            )) : <span style={{ color: "#bbb" }}>No photos.</span>}
            <label style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#277",
              fontWeight: 600,
              fontSize: "2.5em",
              width: 94, height: 72,
              border: "2px dashed #aad",
              borderRadius: 11,
              background: "#f3f8fd"
            }}>
              +
              <input
                type="file"
                style={{ display: "none" }}
                multiple
                accept="image/*"
                onChange={handleUploadPhotos}
              />
              <span style={{ fontSize: "0.45em", color: "#555", fontWeight: 400, marginTop: 4 }}>Add</span>
            </label>
          </div>
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
            marginTop: "29px",
            cursor: "pointer",
            boxShadow: "0 3px 16px #3650f724"
          }}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
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