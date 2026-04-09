const STORAGE_KEY = "smartlift_access_token";

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem(STORAGE_KEY);
  }
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, token);
  }
}

export function clearAccessToken(): void {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
