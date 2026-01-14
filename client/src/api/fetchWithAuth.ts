import { API_BASE_URL } from "./config";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const resolvedToken = token || localStorage.getItem("token") || "";
  return fetch(`${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${resolvedToken}`,
    },
  });
}