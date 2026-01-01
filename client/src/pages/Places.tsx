import React from "react";

export default function Places({ places, loading, onDetail }: { places: any[], loading: boolean, onDetail?: (id: string) => void }) {
  function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }
  return (
    <div style={{ maxWidth: 1060, margin: "30px auto" }}>
      <div className="hero-banner">
        <span role="img" aria-label="home" style={{marginRight:8}}>🏠</span>
        Find your next destination with <b>HBnB</b>
      </div>
      <h2>Places</h2>
      {loading && <div>Loading...</div>}
      {(!places || places.length === 0) && !loading && <div>No places yet.</div>}

      <div className="cards-grid">
        {places.map((place) => (
          <div
            key={place.id}
            className="place-card"
            onClick={onDetail ? () => onDetail(place.id) : undefined}
            tabIndex={0}
          >
            {place.photos && place.photos.length > 0 && place.photos[0]?.url ? (
              <img
                src={`http://localhost:4000${place.photos[0].url}`}
                alt={place.title}
                className="place-card-image"
              />
            ) : (
              <div className="place-card-image" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"#ccc",fontSize:"1.7rem"}}>
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
  );
}