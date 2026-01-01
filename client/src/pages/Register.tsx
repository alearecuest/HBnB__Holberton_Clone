import React, { useState } from "react";
import { register } from "../api/auth";

export default function Register({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(form.email, form.password, form.firstName, form.lastName);
      setSuccess(true);
      setError(null);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Error registering user");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 370, width: "97vw", margin: "auto", marginTop: 32 }}>
      <h2 style={{ textAlign:"center", marginBottom:17 }}>Register</h2>
      <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
      <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
      <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />
      <button type="submit" style={{marginTop:14}}>Create user</button>
      {success && <div style={{ color: "green", marginTop: 14, textAlign:"center" }}>User registered! You can now <b>sign in</b>.</div>}
      {error && <div style={{ color: "red", marginTop: 10, textAlign:"center" }}>{error}</div>}
    </form>
  );
}