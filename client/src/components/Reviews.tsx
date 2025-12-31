import React, { useEffect, useState } from "react";
import { fetchReviews, createReview } from "../api/reviews";
import { useAuth } from "../context/AuthContext";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: { email: string; firstName: string; lastName: string };
  createdAt: string;
}

export default function Reviews({ placeId }: { placeId: string }) {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ comment: "", rating: 5 });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchReviews(placeId)
      .then(data => setReviews(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [placeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await createReview(placeId, {
        rating: Number(form.rating),
        comment: form.comment,
      }, token!);
      setForm({ comment: "", rating: 5 });
      const updated = await fetchReviews(placeId);
      setReviews(updated);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to create review");
    }
    setSending(false);
  }

  return (
    <section style={{ padding: '12px 0 0 0' }}>
      <h4 style={{ margin: '8px 0 8px 0', fontSize: '1.12rem' }}>Reviews</h4>
      {loading && <div>Loading reviews...</div>}
      {reviews.length === 0 && !loading && <div style={{ color: "#888" }}>No reviews yet.</div>}
      {reviews.map(r => (
        <div key={r.id} style={{ borderBottom: "1px solid #eee", marginBottom: 8, paddingBottom: 6 }}>
          <b>{r.user?.firstName || r.user?.email}</b>
          {" — "}
          <span>Rating: <b>{r.rating}/5</b></span>
          <div style={{ margin: "5px 0" }}>{r.comment}</div>
          <small style={{ color: "#888" }}>{new Date(r.createdAt).toLocaleString()}</small>
        </div>
      ))}
      {token && (
        <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>Comment</label>
          <textarea
            value={form.comment}
            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
            placeholder="Write a review..."
            required
            style={{ minHeight: 40, marginBottom: 8, resize: 'vertical', display: "block" }}
          />
          <label style={{ fontWeight: 500, marginRight: 12 }}>
            Rating:{" "}
            <select
              value={form.rating}
              onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
              style={{ marginRight: 8 }}
              required
            >
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <button type="submit" style={{ marginLeft: 8, minWidth: 110 }} disabled={sending}>
            {sending ? "Submitting..." : "Submit review"}
          </button>
        </form>
      )}
      {error && <div style={{ color: "red", marginTop: 6 }}>{error}</div>}
    </section>
  );
}