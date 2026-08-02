import type { RefreshTokenResponse } from "./types";

// The backend base URL is provided exclusively via the VITE_API_BASE_URL
// environment variable (see .env / .env.example). Nothing is hard-coded here.
// If it is not set, requests fall back to a same-origin relative "/api" path,
// which works when the frontend is served behind the same host/reverse proxy.
const RAW_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");

if (!RAW_BASE_URL && import.meta.env.DEV) {
  console.warn(
    "[api] VITE_API_BASE_URL is not set — falling back to a relative '/api' path. " +
      "Create a .env file (see .env.example) to point at your backend.",
  );
}

// All backend routes live under the "/api" prefix.
export const API_BASE_URL = `${RAW_BASE_URL}/api`;

const ACCESS_TOKEN_KEY = "agrisense.access_token";
const REFRESH_TOKEN_KEY = "agrisense.refresh_token";
const USER_KEY = "agrisense.user";
const REMEMBER_KEY = "agrisense.remember";

// ---------------------------------------------------------------------------
// Token storage (hardened)
//
// Strategy for reduced XSS/persistence exposure:
//   • The access token lives primarily IN MEMORY (not readable from disk).
//   • It is mirrored to sessionStorage so a page reload in the same tab keeps
//     the session, but it is wiped when the tab/browser closes.
//   • The refresh token is placed in localStorage only when the user opts into
//     "Remember me"; otherwise it also uses sessionStorage.
//   • Everything is cleared atomically on logout / auth failure.
//
// Real end-to-end protection requires httpOnly cookies from the backend; since
// the API uses bearer tokens this is the strongest practical client posture.
// ---------------------------------------------------------------------------

let inMemoryAccessToken: string | null = null;

function isRemembered(): boolean {
  return localStorage.getItem(REMEMBER_KEY) === "1";
}

function persistentStore(): Storage {
  return isRemembered() ? localStorage : sessionStorage;
}

export const tokenStore = {
  getAccessToken(): string | null {
    if (inMemoryAccessToken) return inMemoryAccessToken;
    // Rehydrate from session on reload.
    const fromSession = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (fromSession) inMemoryAccessToken = fromSession;
    return inMemoryAccessToken;
  },
  getRefreshToken(): string | null {
    return (
      localStorage.getItem(REFRESH_TOKEN_KEY) ||
      sessionStorage.getItem(REFRESH_TOKEN_KEY)
    );
  },
  setRemember(remember: boolean) {
    if (remember) localStorage.setItem(REMEMBER_KEY, "1");
    else localStorage.removeItem(REMEMBER_KEY);
  },
  setTokens(accessToken: string, refreshToken?: string) {
    inMemoryAccessToken = accessToken;
    // Access token: session only (per-tab, cleared on close).
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      // Refresh token: localStorage only when "remember me" is on.
      const store = persistentStore();
      const other = store === localStorage ? sessionStorage : localStorage;
      store.setItem(REFRESH_TOKEN_KEY, refreshToken);
      other.removeItem(REFRESH_TOKEN_KEY);
    }
  },
  clear() {
    inMemoryAccessToken = null;
    [localStorage, sessionStorage].forEach((s) => {
      s.removeItem(ACCESS_TOKEN_KEY);
      s.removeItem(REFRESH_TOKEN_KEY);
      s.removeItem(USER_KEY);
    });
    localStorage.removeItem(REMEMBER_KEY);
  },
  getStoredUser<T>(): T | null {
    const raw =
      persistentStore().getItem(USER_KEY) ||
      localStorage.getItem(USER_KEY) ||
      sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setStoredUser(user: unknown) {
    persistentStore().setItem(USER_KEY, JSON.stringify(user));
  },
};

// ---------------------------------------------------------------------------
// Error type
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Called when the session becomes irrecoverable (e.g. refresh fails).
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  // When true, the Authorization header is attached (default true, except
  // requests are still allowed without a token).
  auth?: boolean;
  // Skip the automatic refresh-and-retry (used by the refresh call itself).
  skipRefresh?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

function buildUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseResponse(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json().catch(() => null);
  }
  const text = await res.text().catch(() => "");
  return text || null;
}

function extractMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const msg = (data as Record<string, unknown>).message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
    const err = (data as Record<string, unknown>).error;
    if (typeof err === "string") return err;
  }
  if (typeof data === "string" && data) return data;
  return fallback;
}

// De-duplicate concurrent refresh calls.
let refreshPromise: Promise<string | null> | null = null;

/** Public helper so the auth layer can proactively refresh before expiry. */
export function refreshSession(): Promise<string | null> {
  return refreshAccessToken();
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(buildUrl("/auth/refresh"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as RefreshTokenResponse;
        if (data?.access_token) {
          tokenStore.setTokens(data.access_token);
          return data.access_token;
        }
        return null;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

async function doRequest<T>(path: string, options: RequestOptions): Promise<T> {
  const { method = "GET", body, auth = true, skipRefresh = false, signal } = options;

  const headers: Record<string, string> = { ...(options.headers || {}) };
  const isFormData = body instanceof FormData;

  if (body !== undefined && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = tokenStore.getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path), {
    method,
    headers,
    signal,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  });

  // Attempt a single refresh-and-retry on 401.
  if (res.status === 401 && auth && !skipRefresh) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return doRequest<T>(path, { ...options, skipRefresh: true });
    }
    tokenStore.clear();
    onUnauthorized?.();
  }

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new ApiError(
      extractMessage(data, `Request failed with status ${res.status}`),
      res.status,
      data,
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    doRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    doRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    doRequest<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    doRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    doRequest<T>(path, { ...options, method: "DELETE" }),
};
