import React, { useEffect, useState } from "react";
import { fetchPlaces } from "../api/places";
import { PlacesMap } from "../components/PlaceMap";
import FeaturedCarousel from "../components/FeaturedCarousel";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchBar from "../components/SearchBar";

export default function Places() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    location: "",
    dateRange: { from: "", to: "" },
    guests: 1
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("hbnb-favorites") || "[]");
    } catch {
      return [];
    }
  });
  function toggleFavorite(placeId: string) {
    setFavorites(favs => {
      let newFavs;
      if (favs.includes(placeId)) {
        newFavs = favs.filter(id => id !== placeId);
      } else {
        newFavs = [...favs, placeId];
      }
      localStorage.setItem("hbnb-favorites", JSON.stringify(newFavs));
      return newFavs;
    });
  }

  const [showOnlyFavs, setShowOnlyFavs] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setLoading(true);
    fetchPlaces()
      .then((data) => setPlaces(data))
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, []);

  function formatPrice(price: number) {
    return new Intl.NumberFormat(i18n.language === 'es' ? 'es-UY' : 'en-US', {
      style: 'currency',
      currency: i18n.language === 'es' ? 'UYU' : 'USD'
    }).format(price);
  }

  const isMobile = window.innerWidth < 900;
  const featured = Array.isArray(places) ? places.slice(0, 5) : [];

  const filteredPlaces = places.filter(place => {
    const q = filters.location.trim().toLowerCase();
    const matchLocation = !q ||
      (place.title && place.title.toLowerCase().includes(q)) ||
      (place.description && place.description.toLowerCase().includes(q));
    const matchGuests = !place.maxGuests || filters.guests <= place.maxGuests;
    return matchLocation && matchGuests;
  });

  const visiblePlaces = showOnlyFavs
    ? filteredPlaces.filter(p => favorites.includes(p.id))
    : filteredPlaces;

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
        {t("home.hero")}
      </div>

      <SearchBar
        onSearch={params => setFilters(params)}
      />

      <div style={{ maxWidth: 1370, margin: "0 auto" }}>
        <h2 style={{
          marginLeft: 8,
          marginTop: 6,
          marginBottom: 8,
          fontSize: "2rem",
          letterSpacing: -1,
          color: "#204078"
        }}>
          {t("home.featured")}
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
          <h2 style={{ marginTop: 0 }}>{t("home.places")}</h2>
          
          <div style={{ margin: "14px 0 12px", textAlign: "right" }}>
            <button
              style={{
                fontWeight: 600,
                fontSize: "1em",
                cursor: "pointer",
                background: showOnlyFavs ? "#ffe7ee" : "#f7f7fc",
                color: showOnlyFavs ? "#e23" : "#7a8",
                border: "1.6px solid #bbdbec",
                borderRadius: "7px",
                padding: "7px 16px",
                marginRight: 20
              }}
              onClick={() => setShowOnlyFavs(f => !f)}
            >
              {showOnlyFavs ? t("places.showall", "Show all") : t("places.onlyfavs", "Only favorites")}
            </button>
          </div>

          {loading && <div>{t("general.loading", "Loading...")}</div>}
          {(!visiblePlaces || visiblePlaces.length === 0) && !loading && (
            <div>{t("general.noplaces", "No places yet.")}</div>
          )}
          <div className="cards-grid">
            {visiblePlaces.map((place) => (
              <div
                key={place.id}
                className="place-card"
                tabIndex={0}
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => navigate(`/places/${place.id}`)}
              >
                <button
                  className="fav-btn"
                  onClick={e => {
                    e.stopPropagation();
                    toggleFavorite(place.id);
                  }}
                  title={favorites.includes(place.id) ? t("places.removefav", "Remove from favorites") : t("places.addfav", "Add to favorites")}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 12,
                    zIndex: 3,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "2.1em"
                  }}
                  tabIndex={-1}
                  aria-label={favorites.includes(place.id) ? "Unfavorite" : "Favorite"}
                >
                  {favorites.includes(place.id)
                    ? <span style={{ color: "#e23" }}>★</span>
                    : <span style={{ color: "#aaa" }}>☆</span>}
                </button>

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
                    {t("general.noimage", "No image")}
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
            places={filteredPlaces.filter(
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