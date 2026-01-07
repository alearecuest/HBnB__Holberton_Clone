import { useAuth } from "../context/AuthContext";

export async function createPlace(place: { title: string, description: string, price: number, latitude: number, longitude: number }, token: string) {
  const res = await fetch("http://localhost:4000/api/v1/places", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(place)
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "The place could not be created");
  }
  return await res.json();
}

export async function fetchPlaces() {
  const res = await fetch("http://localhost:4000/api/v1/places");
  if (!res.ok) throw new Error("Error loading places");
  return await res.json();
}