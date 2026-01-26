import React, { useEffect, useState, useRef } from "react";
import { createPlace } from "../api/places";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

interface Amenity {
  id: string;
  name: string;
  description: string;
}

const amenityNameMap: Record<string, { es: string, en: string }> = {
  "Wi-Fi": { es: "Wi-Fi", en: "Wi-Fi" },
  "TV": { es: "TV", en: "TV" },
  "Kitchen": { es: "Cocina", en: "Kitchen" },
  "Air conditioning": { es: "Aire acondicionado", en: "Air conditioning" },
  "Parking": { es: "Estacionamiento", en: "Parking" },
  "Pets allowed": { es: "Se permiten mascotas", en: "Pets allowed" },
  "Pool": { es: "Piscina", en: "Pool" },
  "Barbecue": { es: "Parrillero", en: "Barbecue" }
};

function arrayfyFiles(fileList: FileList | null): File[] {
  if (!fileList) return [];
  return Array.from(fileList);
}

export default function CreatePlace({ onCreated }: { onCreated: () => void }) {
  const { t, i18n } = useTranslation();
  const { token } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", price: "", latitude: "", longitude: "" });
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/v1/amenities")
      .then(res => res.json())
      .then(setAmenities);
  }, []);

  if (!token) return <div>{t("createplace.needlogin", "You need to be logged in to create a place.")}</div>;

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
      return setError(t("form.errtitle", "Title is required."));
    if (!form.description.trim())
      return setError(t("form.errdesc", "Description is required."));
    if (!form.price)
      return setError(t("form.errprice", "Price is required."));
    if (photos.length < 1)
      return setError(t("form.errphoto", "At least one photo is required."));
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
          throw new Error(err.error || t("form.errupload", "Error uploading photo(s)"));
        }
      }
      setError(null);
      setForm({ title: "", description: "", price: "", latitude: "", longitude: "" });
      setSelectedAmenities([]);
      setPhotos([]);
      onCreated();
    } catch (err: any) {
      setError(err.message || t("form.errcreate", "Error creating place"));
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: 640,
      minWidth: 340,
      width: "99vw",
      margin: "38px auto",
      background: "rgba(255,255,255,0.33)",
      borderRadius: 24,
      boxShadow: "0 8px 38px #90ccff24, 0 2px 18px #86bafd23",
      padding: "46px 42px 36px 42px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <h2>{t("createplace.title", "Create place")}</h2>
      <label htmlFor="title" style={{ fontWeight: 500 }}>{t("form.title", "Title")}</label>
      <input id="title" name="title" placeholder={t("form.titleph", "e.g. Cozy Loft Downtown")} value={form.title} onChange={handleChange} required />

      <label htmlFor="description" style={{ fontWeight: 500 }}>{t("form.description", "Description")}</label>
      <input id="description" name="description" placeholder={t("form.descriptionph", "e.g. 2 bedrooms, kitchen, bathroom")} value={form.description} onChange={handleChange} required />

      <label htmlFor="price" style={{ fontWeight: 500 }}>{t("form.price", "Price")}</label>
      <input id="price" name="price" type="number" placeholder={t("form.priceph", "e.g. U$S 50 per day")} value={form.price} onChange={handleChange} required />

      <label htmlFor="latitude" style={{ fontWeight: 500 }}>{t("form.latitude", "Latitude")}</label>
      <input id="latitude" name="latitude" type="number" placeholder={t("form.latitudeph", "e.g. -34.6037")} value={form.latitude} onChange={handleChange} required />

      <label htmlFor="longitude" style={{ fontWeight: 500 }}>{t("form.longitude", "Longitude")}</label>
      <input id="longitude" name="longitude" type="number" placeholder={t("form.longitudeph", "e.g. -58.3816")} value={form.longitude} onChange={handleChange} required />

      {/* Amenities section */}
      <div style={{ margin: "24px 0 19px 0", width:"100%"}}>
        <b style={{ fontSize: "1.14em" }}>{t("form.amenities", "Select amenities:")}</b>
        <div style={{ marginTop: 13, marginBottom: 7, display: "flex", flexWrap: "wrap", gap: 14, width:"100%" }}>
          {amenities.length === 0 && <span style={{ color: "#aaa" }}>{t("form.noamenities", "No amenities available")}</span>}
          {amenities.map(a => (
            <label key={a.id} style={{
              background: "#f8fbff",
              border: "1.5px solid #cbe0fe",
              borderRadius: 8,
              padding: "6px 12px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              minWidth: 110,
              marginBottom: 5
            }}>
              <input
                type="checkbox"
                checked={selectedAmenities.includes(a.id)}
                value={a.id}
                onChange={() => handleAmenityChange(a.id)}
                style={{ marginRight: 7 }}
              />
              {amenityNameMap[a.name] ? amenityNameMap[a.name][i18n.language] : a.name}
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
          cursor: "copy",
          width: "100%"
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
          ? <span>{t("form.photonone", "Drag and drop photos here, or")} <u>{t("form.selectclick", "click to select")}</u>.</span>
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
                    alt={t("form.photopreview", "Preview")}
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
                    title={t("form.photoremove", "Remove photo")}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </div>
      <button type="submit" disabled={submitting} style={{minWidth:160, fontWeight:800, fontSize:"1.06em"}}>
        {submitting ? t("createplace.creating", "Creating...") : t("createplace.createbtn", "Create place")}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
}