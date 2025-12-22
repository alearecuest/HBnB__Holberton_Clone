import React, { useState } from "react";
import { register } from "../api/auth";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(form);
      setSuccess(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al registrar usuario");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  if (success)
    return (
      <div>
        ¡Usuario registrado! Ahora puedes <b>iniciar sesión</b>.
      </div>
    );

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: "auto", marginTop: 50 }}>
      <h2>Registrarse</h2>
      <input name="firstName" placeholder="Nombre" value={form.firstName} onChange={handleChange} required />
      <input name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
      <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />
      <button type="submit">Crear usuario</button>
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
    </form>
  );
}