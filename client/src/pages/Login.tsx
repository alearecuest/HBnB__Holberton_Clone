import React, { useState } from "react";
import { login as apiLogin } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await apiLogin(email, password);
      login(data.token);
      setError(null);
      alert("Login exitoso");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "auto", marginTop: 80 }}>
      <h2>Login</h2>
      <div>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
        />
      </div>
      <button type="submit">Entrar</button>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
    </form>
  );
}