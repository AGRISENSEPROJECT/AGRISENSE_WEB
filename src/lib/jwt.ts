// Minimal, dependency-free JWT payload decoding. This is used ONLY to read the
// expiry claim for proactive token refresh. It never verifies the signature –
// verification is the backend's responsibility.

interface JwtPayload {
  exp?: number; // seconds since epoch
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  try {
    return atob(padded);
  } catch {
    return "";
  }
}

export function decodeJwt(token: string | null | undefined): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const json = base64UrlDecode(parts[1]);
  if (!json) return null;
  try {
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Returns the token expiry in milliseconds since epoch, or null. */
export function getTokenExpiry(token: string | null | undefined): number | null {
  const payload = decodeJwt(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000;
}

/** True when the token is missing or past (optionally within `skewMs`) its expiry. */
export function isTokenExpired(token: string | null | undefined, skewMs = 0): boolean {
  const expiry = getTokenExpiry(token);
  if (expiry === null) return false; // Can't tell – let the server decide.
  return Date.now() + skewMs >= expiry;
}
