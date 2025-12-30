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
  const { token, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ comment: "", rating: 5 });

  useEffect(() => {
    setLoading(true);
    fetchReviews(placeId)
      .then(data => setReviews(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [placeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createReview(placeId, form, token!);
      setForm({ comment: "", rating: 5 });
      const updated = await fetchReviews(placeId);
      setReviews(updated);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al crear review");
    }
  }

  return (
    <div>
      <h4>Reseñas</h4>
      {loading && <div>Cargando reviews...</div>}
      {reviews.map(r => (
        <div key={r.id} style={{borderBottom: "1px solid #ddd", marginBottom: 8}}>
          <b>{r.user.firstName || r.user.email}</b> — Valoración: {r.rating}/5
          <div>{r.comment}</div>
          <small>{new Date(r.createdAt).toLocaleString()}</small>
        </div>
      ))}
      {token && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={form.comment}
            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
            placeholder="Escribe una reseña…"
            required
          />
          <select
            value={form.rating}
            onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
          >
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button type="submit">Enviar reseña</button>
        </form>
      )}
      {error && <div style={{color:"red"}}>{error}</div>}
    </div>
  )
}