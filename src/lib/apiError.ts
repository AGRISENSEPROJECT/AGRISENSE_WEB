import { ApiError } from "@/api/client";

/** Extract a machine error code from an API error body (e.g. PLAN_LIMIT). */
export function getApiErrorCode(err: unknown): string | null {
  if (!(err instanceof ApiError) || !err.data || typeof err.data !== "object") return null;
  const code = (err.data as Record<string, unknown>).code;
  return typeof code === "string" ? code : null;
}

export function getApiErrorLimit(err: unknown): string | null {
  if (!(err instanceof ApiError) || !err.data || typeof err.data !== "object") return null;
  const limit = (err.data as Record<string, unknown>).limit;
  return typeof limit === "string" ? limit : null;
}
