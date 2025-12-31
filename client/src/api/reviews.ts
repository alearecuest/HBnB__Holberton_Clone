export async function fetchReviews(placeId: string) {
  const res = await fetch(`http://localhost:4000/api/v1/places/${placeId}/reviews`);
  if (!res.ok) throw new Error("Could not fetch reviews");
  return await res.json();
}

export async function createReview(placeId: string, review: { rating: number; comment: string }, token: string) {
  const res = await fetch(`http://localhost:4000/api/v1/places/${placeId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      rating: Number(review.rating),
      comment: review.comment
    }),
  });

  if (!res.ok) {
    let err = "Failed to create review";
    try {
      const data = await res.json();
      err = data.error || err;
    } catch { /* ignore */ }
    throw new Error(err);
  }
  return await res.json();
}