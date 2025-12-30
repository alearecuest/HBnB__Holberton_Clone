export async function fetchReviews(placeId: string) {
  const res = await fetch(`http://localhost:4000/api/v1/places/${placeId}/reviews`);
  if (!res.ok) throw new Error("No se pudieron obtener las reviews");
  return await res.json();
}

export async function createReview(placeId: string, review: { rating: number; comment: string }, token: string) {
  const res = await fetch(`http://localhost:4000/api/v1/places/${placeId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(review)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al crear la review");
  }
  return await res.json();
}