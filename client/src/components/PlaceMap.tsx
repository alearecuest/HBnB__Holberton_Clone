import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function PlacesMap({
  places,
  onMarkerClick,
  height = "400px"
}: {
  places: Array<{
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    price: number;
    photos?: { url: string }[];
  }>;
  onMarkerClick?: (place: any) => void;
  height?: string;
}) {
  if (!places || places.length === 0)
    return <div style={{ color: "#777", padding: "2em", textAlign: "center" }}>No places on map.</div>;
  const avgLat = places.reduce((sum, p) => sum + p.latitude, 0) / places.length;
  const avgLon = places.reduce((sum, p) => sum + p.longitude, 0) / places.length;

  return (
    <div style={{ width: "100%", height }}>
      <MapContainer center={[avgLat, avgLon]} zoom={10} style={{ width: "100%", height }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            eventHandlers={{
              click: () => onMarkerClick?.(place),
            }}
          >
            <Popup>
              <b>{place.title}</b>
              <br />
              Precio: ${place.price}
              {place.photos && place.photos[0] && (
                <div>
                  <img src={`http://localhost:4000${place.photos[0].url}`} alt={place.title}
                    style={{ maxWidth: 120, borderRadius: 6, marginTop: 5 }} />
                </div>
              )}
              <br />
              <button
                style={{
                  marginTop: 5,
                  padding: "4px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#2b65ec",
                  color: "#fff",
                  cursor: "pointer"
                }}
                onClick={() => onMarkerClick?.(place)}
              >
                Ver detalle
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default function PlaceMap({
  latitude,
  longitude,
  title = "Property location",
}: {
  latitude: number;
  longitude: number;
  title?: string;
}) {
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    return <div style={{ color: "#b00", fontSize: "1em", padding: 12 }}>Location unavailable</div>;
  }
  return (
    <div style={{ width: "100%", borderRadius: 14, overflow: "hidden", boxShadow: "0 3px 15px #aac9" }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ width: "100%", height: 240 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>{title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}