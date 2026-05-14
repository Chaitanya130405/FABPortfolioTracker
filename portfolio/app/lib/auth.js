"use client";

export const AUTH_STORAGE_KEY = "fab-auth-session";

function readCookie(name) {
  if (typeof document === "undefined") {
    return "";
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function writeCookie(name, value, maxAgeSeconds) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

export function setAuthSession(session) {
  if (!session?.token || typeof window === "undefined") {
    return;
  }

  writeCookie("token", session.token, 60 * 30);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  writeCookie("token", "", 0);
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getStoredAuthSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
  console.log("Retrieved session from localStorage:", rawSession);

  if (!rawSession) {
    return null;
  }

  try {
    console.log("parsed data raw: ", JSON.parse(rawSession));
    return JSON.parse(rawSession);
  } catch {
    return null;
  }
}

export function getAuthToken() {
  const storedSession = getStoredAuthSession();

  if (storedSession?.token) {
    return storedSession.token;
  }

  return readCookie("token");
}
