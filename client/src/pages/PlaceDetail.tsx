import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Reviews from "../components/Reviews";
import PhotoGalleryLightbox from "../components/PhotoGalleryLightbox";
import BookingCardSidebar from "../components/BookingCardSidebar";
import PlaceMap from "../components/PlaceMap";
import PlaceAvailabilityCalendar from "../components/PlaceAvailabilityCalendar";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { FaWifi, FaTv, FaParking, FaSwimmer } from "react-icons/fa";
import { MdOutlineAcUnit, MdPets } from "react-icons/md";
import { GiCookingPot, GiBarbecue } from "react-icons/gi";

const iconsMap: { [key: string]: JSX.Element } = {
  FaWifi: <FaWifi style={{marginRight:6, fontSize:19, verticalAlign:'middle'}}/>,
  FaTv: <FaTv style={{marginRight:6, fontSize:19, verticalAlign:'middle'}}/>,
  GiCookingPot: <GiCookingPot style={{marginRight:6, fontSize:19, verticalAlign:'middle'}}/>,
  MdOutlineAcUnit: <MdOutlineAcUnit style={{marginRight:6, fontSize:19, verticalAlign:'middle'}}/>,
  FaParking: <FaParking style={{marginRight:6, fontSize:19, verticalAlign:'middle'}}/>,
  MdPets: <MdPets style={{marginRight:6, fontSize:19, verticalAlign:'middle'}}/>,
  FaSwimmer: <FaSwimmer style={{marginRight:6, fontSize:19, verticalAlign:'middle'}}/>,
  GiBarbecue: <GiBarbecue style={{marginRight:6, fontSize:19, verticalAlign:'middle'}}/>,
};

function formatPrice(price: number, lang: string) {
  return new Intl.NumberFormat(lang === 'es' ? 'es-UY' : 'en-US', {
    style: 'currency',
    currency: lang === 'es' ? 'UYU' : 'USD'
  }).format(price);
}

function GalleryGrid({
  photos,
  onShowAll,
  onDeletePhoto,
  isOwner,
}: {
  photos: any[];
  onShowAll: () => void;
  onDeletePhoto?: (index: number) => void;
  isOwner: boolean;
}) {
  const { t } = useTranslation();
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

  if (!photos || photos.length === 0) {
    return (
      <div style={{
        padding: 32,
        background: "#f1f4fa",
        borderRadius: 18,
        minHeight: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 18px #0002",
        fontWeight: 600,
        color: "#667",
        letterSpacing: "0.5px"
      }}>
        <span role="img" aria-label="No photo" style={{ fontSize: "3em", marginRight: 15 }}>🏡</span>
        {t("place.nophotos", "No photos added yet. Be the first to upload!")}
      </div>
    );
  }
  if (photos.length === 1) {
    return (
      <div style={{
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 3px 22px #acc7fe27",
        margin: "18px 0 30px 0",
        position: "relative"
      }}>
        <img src={`http://localhost:4000${photos[0].url}`} alt="Place" style={{
          width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 18
        }} />
        {isOwner && onDeletePhoto && (
          <button
            onClick={() => onDeletePhoto(0)}
            style={deleteBtnStyle}
            title={t("place.deletephoto", "Delete photo")}
          >×</button>
        )}
      </div>
    );
  }
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1.8fr 1fr",
      gap: "8px",
      borderRadius: "18px",
      overflow: "hidden",
      minHeight: "300px",
      boxShadow: "0 3px 22px #acc7fe27",
      margin: "18px 0 30px 0",
      position: "relative"
    }}>
      <div style={{ gridRow: "1 / span 2", position: "relative", overflow: "hidden" }}>
        <img
          src={`http://localhost:4000${photos[0].url}`}
          alt="Main place"
          style={{
            width: "100%",
            height: "100%",
            maxHeight: "420px",
            objectFit: "cover",
            borderRadius: "15px 0 0 15px"
          }}
        />
        {isOwner && onDeletePhoto && (
          <button
            onClick={() => onDeletePhoto(0)}
            style={deleteBtnStyle}
            title={t("place.deletephoto", "Delete photo")}
          >×</button>
        )}
      </div>
      {/* Grid of up to 4 more */}
      <div style={{
        display: "grid",
        gridTemplateRows: "1fr 1fr",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px"
      }}>
        {photos.slice(1, 5).map((photo, i) => (
          <div key={i} style={{
            width: "100%",
            height: "140px",
            overflow: "hidden",
            borderRadius:
              i === 0 ? "0 15px 0 0" :
                i === 1 ? "0 0 0 0" :
                  i === 2 ? "0 0 15px 0" :
                    i === 3 ? "0 0 0 0" : 0,
            position: "relative"
          }}>
            <img
              src={`http://localhost:4000${photo.url}`}
              alt={`Gallery ${i + 2}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "inherit"
              }}
            />
            {isOwner && onDeletePhoto && (
              <button
                onClick={() => onDeletePhoto(i + 1)}
                style={deleteBtnStyle}
                title={t("place.deletephoto", "Delete photo")}
              >×</button>
            )}
          </div>
        ))}
      </div>
      {photos.length > 5 && (
        <button
          onClick={onShowAll}
          style={{
            position: "absolute",
            bottom: "18px",
            right: "20px",
            padding: "10px 20px",
            borderRadius: "14px",
            border: "none",
            background: "#fff",
            color: "#223",
            fontWeight: "700",
            boxShadow: "0 2px 8px #aaa9",
            cursor: "pointer",
            zIndex: 2
          }}
        >{t("place.showallphotos", "Show all photos")}</button>
      )}
    </div>
  );
}

export default function PlaceDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setFetchError(null);
    fetch(`http://localhost:4000/api/v1/places/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        if (!data) throw new Error('Place data empty!');
        setPlace(data);
      })
      .catch((err) => {
        setPlace(null);
        setFetchError(err.message || "Unknown error");
        console.error('Failed to load place:', err);
        alert('Error loading place: ' + (err.message || "Unknown error"));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user && place && place.owner && String(user.id) === String(place.owner.id);

  async function handleDeletePhoto(idx: number) {
    if (!window.confirm(t("place.confirmdeletephoto", "Are you sure you want to delete this photo?"))) return;
    const res = await fetch(`http://localhost:4000/api/v1/places/${place.id}/photos/${idx}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const newPlace = await fetch(`http://localhost:4000/api/v1/places/${place.id}`).then(r => r.json());
      setPlace(newPlace);
    } else {
      alert(t("place.errordeletephoto", "Error deleting photo."));
    }
  }

  if (loading) return <div style={{ margin: 40, fontSize: "1.5em" }}>{t("general.loading", "Loading...")}</div>;
  if (fetchError) return <div style={{ margin: 40, color: "#b00", fontWeight: 700, fontSize: "1.2em" }}>
    {t("general.errorloading", { error: fetchError }, `Error: ${fetchError}`)}
    <br />Check console/network tab for more info.
  </div>;
  if (!place) return <div style={{ margin: 40, fontSize: "1.5em", color: "#a00" }}>{t("general.noplace", "Place not found")}</div>;

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "2rem auto",
        display: "grid",
        gridTemplateColumns: "1.7fr 1.15fr",
        gap: "40px",
        fontFamily: "Montserrat, Arial, sans-serif"
      }}
    >
      {/* LEFT COLUMN */}
      <div>
        <button onClick={() => navigate("/")} style={{
          marginBottom: 18, background: "#eee", border: "none", padding: "8px 16px", borderRadius: 7, cursor: "pointer", fontSize: "1rem"
        }}>{t("place.back", "← Back to places")}</button>

        <div className="place-detail-header" style={{ display: "flex", alignItems: "flex-end", gap: 18, marginBottom: 7 }}>
          <h2 className="place-detail-title"
              style={{
                fontSize: "2.23rem",
                fontWeight: 900,
                color: "#1a245f",
                letterSpacing: "-1.7px",
                margin: 0,
                padding: 0,
              }}>
            {place.title}
          </h2>
          {isOwner && (
            <button
              className="vibrant-btn"
              style={{
                marginLeft: 16,
                marginBottom: 5,
                padding: "8px 25px",
                fontWeight: 800
              }}
              onClick={() => navigate(`/places/${place.id}/edit`)}
            >
              {t("place.edit", "Edit publication")}
            </button>
          )}
        </div>
        <GalleryGrid
          photos={place.photos || []}
          onShowAll={() => setGalleryOpen(true)}
          onDeletePhoto={isOwner ? handleDeletePhoto : undefined}
          isOwner={!!isOwner}
        />
        <div style={{
          margin: "28px 0 22px 0",
          padding: "14px 0 8px 0",
          display: "flex",
          flexWrap: "wrap",
          gap: 18
        }}>
          <span style={{ fontWeight: 800, fontSize: "1.17rem", marginRight: 18 }}>{t("place.amenities", "Amenities:")}</span>
          {place.amenities && place.amenities.length > 0
            ? place.amenities.map((am: any) => (
              <div key={am.id}
                style={{
                  background: "#f9fbfe",
                  borderRadius: 9,
                  padding: "6px 12px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#274e88",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 2px 6px #acc7fe13"
                }}>
                {am.icon && iconsMap[am.icon] ? iconsMap[am.icon] : <FaTv style={{ marginRight: 6 }} />}
                {am.name}
              </div>
            ))
            : <span style={{ color: "#998" }}>{t("place.noamenities", "No amenities listed")}</span>
          }
        </div>
        <div style={{ color: "#7a7a7a", marginBottom: 13, fontSize: "1.11rem" }}>{place.description}</div>
        <div style={{ fontSize: "1.18rem", margin: "10px 0 9px 0", color: "#2a446e" }}>
          <b>{t("place.price", "Price:")} </b>
          {formatPrice(place.price, i18n.language)}
          <span style={{ marginLeft: 18 }}>
            <b>{t("place.lat", "Latitude:")}</b> {Number(place.latitude).toFixed(2)}, <b>{t("place.long", "Longitude:")}</b> {Number(place.longitude).toFixed(2)}
          </span>
        </div>
        <PlaceAvailabilityCalendar placeId={place.id} isOwner={!!isOwner} token={token} i18nLanguage={i18n.language} />
        {!isOwner && <Reviews placeId={place.id} />}
        {isOwner && (
          <button
            onClick={async () => {
              if (window.confirm(t("place.confirmdelete", "Are you sure you want to delete this place?"))) {
                const res = await fetch(`http://localhost:4000/api/v1/places/${place.id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                  alert(t("place.deletedsuccess", "Place deleted!"));
                  navigate("/");
                } else {
                  alert(t("place.errordelete", "Error deleting place."));
                }
              }
            }}
            className="vibrant-btn"
            style={{
              marginTop: "32px",
              padding: "13px 34px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "1.03em"
            }}
          >
            {t("place.delete", "Delete place")}
          </button>
        )}
      </div>
      {/* RIGHT COLUMN (SIDEBAR) */}
      <div>
        <div className="glass"
          style={{
            padding: "28px 24px 18px 24px",
            marginBottom: "38px",
            borderRadius: 18,
            boxShadow: "0 6px 22px #acc7fe1f",
            background: "rgba(255,255,255,0.27)",
            backdropFilter: "blur(14px)"
          }}>
          <BookingCardSidebar
            price={place.price}
            onReserve={(data) => alert(t("place.reservelogic", "Reservation logic soon!") + "\n" + JSON.stringify(data, null, 2))}
          />
        </div>
        <div className="glass"
          style={{
            borderRadius: 18,
            overflow: "hidden",
            marginBottom: "10px",
            boxShadow: "0 6px 22px #acc7fe1f",
            background: "rgba(255,255,255,0.28)",
            backdropFilter: "blur(14px)",
            minHeight: 440,
            minWidth: 470,
            width: 470,
            height: 440,
            maxWidth: "100%",
            maxHeight: "100%"
          }}>
          <PlaceMap
            latitude={place.latitude}
            longitude={place.longitude}
            title={place.title}
            height="410px"
            width="470px"
          />
        </div>
      </div>
      <PhotoGalleryLightbox
        open={galleryOpen}
        photos={place.photos || []}
        onClose={() => setGalleryOpen(false)}
        title={place.title}
      />
    </div>
  );
}