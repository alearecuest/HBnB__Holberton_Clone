import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

interface Amenity {
  id: string;
  name: string;
  description: string;
}

export default function EditPlace({ id, onBack }: { id: string, onBack: () => void }) {
  const { t } = useTranslation();
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [saving, setSaving] = useState(false);

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const { user, token } = useAuth();

  useEffect(() => {
    fetch(`http://localhost:4000/api/v1/amenities`)
      .then(res => res.json())
      .then(data => setAmenities(data));
  }, []);

  // Load place data
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
        setSelectedAmenities((data.amenities || []).map((a: any) => a.id));
        setLoading(false);
      })
      .catch(() => {
        setError(t("editplace.errorfetch", "Failed to fetch place"));
        setLoading(false);
      });
  }, [id, t]);

  const isOwner = user && place && place.owner && user.id === place.owner.id;

  function handleAmenityChange(amenityId: string) {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  }

  async function handleDeletePhoto(idx: number) {
    if (!window.confirm(t("editplace.deletephoto", "Delete this photo?"))) return;
    const res = await fetch(`http://localhost:4000/api/v1/places/${place.id}/photos/${idx}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const updated = await fetch(`http://localhost:4000/api/v1/places/${place.id}`).then(r => r.json());
      setPlace(updated);

    } else {
      alert(t("editplace.errordeletephoto", "Error deleting photo."));
    }
  }

  async function handleDeletePlace() {
    if (!window.confirm(t("editplace.deleteplace", "Delete this place forever?"))) return;
    const res = await fetch(`http://localhost:4000/api/v1/places/${place.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      alert(t("editplace.deletesuccess", "Place deleted!"));
      onBack();
    } else {
      alert(t("editplace.errordeleteplace", "Error deleting place."));
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
      alert(t("editplace.erroruploadphoto", "Could not upload photos."));
    }
    e.target.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const patch = {
      title,
      description,
      price: parseFloat(`${price}`),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      amenities: selectedAmenities
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
      alert(t("editplace.savesuccess", "Saved!"));
      onBack();
      return;
    } else {
      alert(t("editplace.errorsave", "Could not save changes."));
    }
  }

  if (loading) return <div>{t("general.loading", "Loading...")}</div>;
  if (!place) return <div>{error || t("general.notfound", "Not found")}</div>;

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
    <div className="glass" style={{
      maxWidth: 650,
      margin: "2rem auto",
      padding: 32,
      fontFamily: "Montserrat, Arial, sans-serif"
    }}>
      <button
        onClick={onBack}
        className="vibrant-btn"
        style={{
          marginBottom: 16,
          padding: "8px 18px",
          fontSize: "1em"
        }}
      >← {t("editplace.back", "Back")}</button>
      <h2 style={{ marginTop: 2, fontSize: "1.7rem", fontWeight: 700 }}>{t("editplace.title", "Edit publication")}</h2>
      <form onSubmit={handleSave}>
        <label style={{ display: "block", marginBottom: 9, fontWeight: 600 }}>
          {t("editplace.formtitle", "Title:")}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: "100%", marginTop: 4, marginBottom: 13, padding: 8, borderRadius: 7, border: "1px solid #d9e2ee" }}
            required
          />
        </label>
        <label style={{ display: "block", marginBottom: 13, fontWeight: 600 }}>
          {t("editplace.formdesc", "Description:")}
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 7, border: "1px solid #d9e2ee" }}
            rows={3}
            required
          />
        </label>
        <label style={{ display: "inline-block", marginBottom: 13, fontWeight: 600, marginRight:12 }}>
          {t("editplace.formprice", "Price:")}
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
          {t("editplace.formlat", "Lat:")}
          <input
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
            style={{ width: 90, marginLeft: 6, padding: 6, borderRadius: 7, border: "1px solid #d9e2ee" }}
            required
          />
        </label>
        <label style={{ display: "inline-block" }}>
          {t("editplace.formlon", "Lon:")}
          <input
            value={longitude}
            onChange={e => setLongitude(e.target.value)}
            style={{ width: 90, marginLeft: 6, padding: 6, borderRadius: 7, border: "1px solid #d9e2ee" }}
            required
          />
        </label>
        
        {/* Amenities */}
        <div style={{ margin: "20px 0 18px 0" }}>
          <b style={{ fontSize: "1.08em" }}>{t("editplace.formamenities", "Select amenities:")}</b>
          <div style={{ marginTop: 12, marginBottom: 8, display: "flex", flexWrap: "wrap", gap: 13 }}>
            {amenities.length === 0 && <span style={{ color: "#aaa" }}>{t("editplace.noamenities", "No amenities available")}</span>}
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
        <div style={{ margin: "14px 0 20px 0" }}>
          <b style={{fontSize:"1.07em"}}>{t("editplace.formphotos", "Photos:")}</b>
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
                    title={t("editplace.deletephoto", "Delete photo")}
                  >×</button>
                )}
              </div>
            )) : <span style={{ color: "#bbb" }}>{t("editplace.nophotos", "No photos.")}</span>}
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
              <span style={{ fontSize: "0.45em", color: "#555", fontWeight: 400, marginTop: 4 }}>{t("editplace.addphoto", "Add")}</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="vibrant-btn"
          style={{
            padding: "12px 33px",
            fontWeight: 700,
            fontSize: "1.07em",
            marginTop: "29px",
            boxShadow: "0 3px 16px #3650f724"
          }}>
          {saving ? t("editplace.saving", "Saving...") : t("editplace.save", "Save changes")}
        </button>
      </form>
      {isOwner && (
        <button
          onClick={handleDeletePlace}
          className="vibrant-btn"
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
            boxShadow: "0 3px 16px #fa667526"
          }}>
          {t("editplace.delete", "Delete place")}
        </button>
      )}
    </div>
  );
}