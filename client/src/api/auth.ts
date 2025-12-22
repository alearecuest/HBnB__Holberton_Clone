export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:4000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Login failed");
  }
  return await res.json();
}

export async function register(data: { email: string, password: string, firstName: string, lastName: string }) {
  const res = await fetch("http://localhost:4000/api/v1/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Registration failed");
  }
  return await res.json();
}