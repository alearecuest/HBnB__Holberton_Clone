import React, { useEffect, useState } from "react";
import Reviews from "../components/Reviews";
import PhotoGalleryLightbox from "../components/PhotoGalleryLightbox";
import BookingCardSidebar from "../components/BookingCardSidebar";
import PlaceMap from "../components/PlaceMap";
import { useAuth } from "../context/AuthContext";
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

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

function DummyCalendar() {
  const days = Array.from({ length: 35 });
  return (
    <div style={{
      width: "100%",
      maxWidth: 320,
      borderRadius: 9,
      background: "#f8fafb",
      border: "1.5px solid #d4e8fe",
      padding: "15px 14px 12px 14px",
      fontFamily: "inherit",
      margin: "24px 0 22px 0"
    }}>
      <div style={{ marginBottom: 13, fontWeight: 800, fontSize: "1.11rem" }}>Availability calendar (demo)</div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px"
      }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} style={{ textAlign: "center", fontWeight: 700, color: "#6b7699", fontSize: 13 }}>{d}</div>
        ))}
        {days.map((_, i) =>
          <div key={i}
               style={{
                 width: "2.15em",
                 height: "2.15em",
                 borderRadius: ".58em",
                 background: (i % 10 === 2) ? "#c9eafe" : "#ecf6fc",
                 textAlign: "center",
                 lineHeight: "2.15em",
                 color: "#2e3c52",
                 fontWeight: 600,
                 opacity: (i + 1 < 4 || i > 29) ? 0.19 : 1
               }}>{i + 1 <= 31 ? i + 1 : ""}</div>
        )}
      </div>
    </div>
  );
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
        No photos added yet. Be the first to upload!
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
            title="Delete photo"
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
            title="Delete photo"
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
                onClick={() => onDeletePhoto(i+1)}
                style={deleteBtnStyle}
                title="Delete photo"
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
        >Show all photos</button>
      )}
    </div>
  );
}

export default function PlaceDetail({
  id,
  onBack,
  onEdit
}: {
  id: string,
  onBack: () => void,
  onEdit?: (id: string) => void
}) {
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const { user, token } = useAuth();

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:4000/api/v1/places/${id}`)
      .then(res => res.json())
      .then(data => {
        setPlace(data);
        setLoading(false);
      });
  }, [id]);

  const isOwner = user && place && place.owner && String(user.id) === String(place.owner.id);

  async function handleDeletePhoto(idx: number) {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    const res = await fetch(`http://localhost:4000/api/v1/places/${place.id}/photos/${idx}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const newPlace = await fetch(`http://localhost:4000/api/v1/places/${place.id}`).then(r=>r.json());
      setPlace(newPlace);
    } else {
      alert("Error deleting photo.");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!place) return <div>Not found</div>;

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "2rem auto",
        display: "grid",
        gridTemplateColumns: "1.6fr 0.96fr",
        gap: "44px",
        fontFamily: "Montserrat, Arial, sans-serif"
      }}
    >
      {/* LEFT COLUMN */}
      <div>
        <button onClick={onBack} style={{
          marginBottom: 18, background: "#eee", border: "none", padding: "8px 16px", borderRadius: 7, cursor: "pointer", fontSize: "1rem"
        }}>← Back to places</button>
        
        <h2 style={{
          marginTop: 6, fontSize: "2rem", fontWeight: 700, letterSpacing: "-1.5px"
        }}>{place.title}</h2>
        
        {isOwner && onEdit &&
          <button
            onClick={() => onEdit(place.id)}
            style={{
              background: "#3650f7",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              marginLeft: 12,
              padding: "8px 24px",
              fontWeight: 700,
              fontSize: "1.01em",
              cursor: "pointer",
              boxShadow: "0 2px 8px #3650f72e",
              marginBottom: 16
            }}
          >
            Edit publication
          </button>
        }

        {/* Gallery */}
        <GalleryGrid
          photos={place.photos || []}
          onShowAll={() => setGalleryOpen(true)}
          onDeletePhoto={isOwner ? handleDeletePhoto : undefined}
          isOwner={!!isOwner}
        />

        {/* Amenities */}
        <div style={{
          margin: "28px 0 22px 0",
          padding: "14px 0 8px 0",
          display: "flex",
          flexWrap: "wrap",
          gap: 18
        }}>
          <span style={{ fontWeight: 800, fontSize: "1.17rem", marginRight: 18 }}>Amenities:</span>
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
                {am.icon && iconsMap[am.icon] ? iconsMap[am.icon] : <FaTv style={{marginRight:6}}/>}
                {am.name}
              </div>
            ))
            : <span style={{ color: "#998" }}>No amenities listed</span>
          }
        </div>

        <div style={{ color: "#7a7a7a", marginBottom: 13, fontSize: "1.11rem" }}>{place.description}</div>
        <div style={{ fontSize: "1.18rem", margin: "10px 0 9px 0", color: "#2a446e" }}>
          <b>Price: </b>{formatPrice(place.price)}
          <span style={{ marginLeft: 18 }}><b>Latitude:</b> {place.latitude}, <b>Longitude:</b> {place.longitude}</span>
        </div>

        {/* Dummy calendar */}
        <DummyCalendar />

        <Reviews placeId={place.id} />
        
        {isOwner && (
          <button
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this place?")) {
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
            Delete place
          </button>
        )}
      </div>
      {/* RIGHT COLUMN (SIDEBAR) */}
      <div>
        <div className="glass"
          style={{
            padding: "30px 28px 20px 28px",
            marginBottom: "44px",
            borderRadius: 18,
            boxShadow: "0 6px 22px #acc7fe1f",
            background: "rgba(255,255,255,0.28)",
            backdropFilter: "blur(14px)"
          }}>
          <BookingCardSidebar
            price={place.price}
            onReserve={(data) => alert("Reservation logic soon!\n" + JSON.stringify(data, null, 2))}
          />
        </div>
        <div className="glass"
          style={{
            borderRadius: 18,
            overflow: "hidden",
            marginBottom: "10px",
            boxShadow: "0 6px 22px #acc7fe1f",
            background: "rgba(255,255,255,0.28)",
            backdropFilter: "blur(14px)"
          }}>
          <PlaceMap
            latitude={place.latitude}
            longitude={place.longitude}
            title={place.title}
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