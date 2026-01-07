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
          <Popup>
            {title}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}