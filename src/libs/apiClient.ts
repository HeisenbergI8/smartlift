import { clearAccessToken, getAccessToken } from "./authToken";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    clearAccessToken();
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const isAuthPage = path === "/login" || path === "/register";
      if (!isAuthPage) {
        window.location.href = "/login";
      }
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "Request failed");
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return res.json();
}

export const apiClient = {
  get: <T>(
    url: string,
    config?: { params?: Record<string, string | number | undefined> },
  ): Promise<T> => {
    const searchParams = new URLSearchParams();
    if (config?.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.set(key, String(value));
      });
    }
    const query = searchParams.toString();
    return request<T>(`${url}${query ? `?${query}` : ""}`);
  },
  post: <T>(url: string, data?: unknown): Promise<T> =>
    request<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(url: string, data?: unknown): Promise<T> =>
    request<T>(url, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(url: string, data?: unknown): Promise<T> =>
    request<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(url: string): Promise<T> => request<T>(url, { method: "DELETE" }),
};
