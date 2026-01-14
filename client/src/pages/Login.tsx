import React, { useState } from "react";
import { login as apiLogin } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login({ onSuccess }: { onSuccess?: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      login(data.token, data.user);
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 370, width: "97vw", margin: "auto", marginTop: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Login</h2>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        autoComplete="email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
        required
      />
      <button type="submit" style={{ marginTop: 14 }}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
      {error && <div style={{ color: "red", marginTop: 12, textAlign: "center" }}>{error}</div>}
    </form>
  );
}