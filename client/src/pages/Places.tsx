import React, { useEffect, useState } from "react";
import { fetchPlaces } from "../api/places";
import { PlacesMap } from "../components/PlaceMap";
import FeaturedCarousel from "../components/FeaturedCarousel";
import { useNavigate } from "react-router-dom";

export default function Places() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchPlaces()
      .then((data) => setPlaces(data))
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, []);

  function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }

  const isMobile = window.innerWidth < 900;
  const featured = Array.isArray(places) ? places.slice(0, 5) : [];

  return (
    <div>
      <div style={{
        width: "100%",
        maxWidth: 1020,
        margin: "30px auto 32px auto",
        textAlign: "center",
        fontWeight: 800,
        fontSize: "2.1rem",
        color: "#1A3366",
        letterSpacing: -2,
      }}>
        Find your next destination with HBnB
      </div>

      <div style={{ maxWidth: 1370, margin: "0 auto" }}>
        <h2 style={{
          marginLeft: 8,
          marginTop: 6,
          marginBottom: 8,
          fontSize: "2rem",
          letterSpacing: -1,
          color: "#204078"
        }}>
          Featured Places
        </h2>
        <FeaturedCarousel
          places={featured}
          onSelect={id => navigate(`/places/${id}`)}
        />
      </div>
      <div style={{
        display: isMobile ? "block" : "flex",
        flexWrap: "wrap",
        gap: isMobile ? 0 : 40,
        justifyContent: "center",
        alignItems: "flex-start",
        maxWidth: 1370,
        margin: "20px auto 0 auto"
      }}>
        <div style={{ flex: 2, minWidth: 350 }}>
          <h2 style={{ marginTop: 0 }}>Places</h2>
          {loading && <div>Loading...</div>}
          {(!places || places.length === 0) && !loading && <div>No places yet.</div>}
          <div className="cards-grid">
            {places.map((place) => (
              <div
                key={place.id}
                className="place-card"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/places/${place.id}`)}
              >
                {place.photos && place.photos.length > 0 && place.photos[0]?.url ? (
                  <img
                    src={`http://localhost:4000${place.photos[0].url}`}
                    alt={place.title}
                    className="place-card-image"
                  />
                ) : (
                  <div
                    className="place-card-image"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ccc",
                      fontSize: "1.7rem",
                    }}
                  >
                    No image
                  </div>
                )}
                <div className="place-card-content">
                  <div className="place-card-title">{place.title}</div>
                  <div style={{ color: "#444", fontSize: "1rem" }}>{place.description}</div>
                  <div style={{ margin: "7px 0 0", fontSize: "1.05rem", color: "#1b3d6d" }}>
                    <b>{formatPrice(place.price)}</b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          flex: 1,
          minWidth: 330,
          maxWidth: 450,
          marginTop: isMobile ? 35 : 120,
          alignSelf: "flex-start",
          position: isMobile ? "static" : "relative",
          height: "520px"
        }}>
          <PlacesMap
            places={places.filter(
              (p) =>
                typeof p.latitude === "number" &&
                typeof p.longitude === "number" &&
                !isNaN(p.latitude) && !isNaN(p.longitude)
            )}
            onMarkerClick={p => navigate(`/places/${p.id}`)}
            height={isMobile ? "340px" : "500px"}
          />
        </div>
      </div>
    </div>
  );
}