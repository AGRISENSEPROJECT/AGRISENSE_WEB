import { useMemo } from "react";
import { governmentService, ngoService } from "@/api";
import { useAuth } from "@/context/useAuth";

/** Pick NGO vs Government API surface from the signed-in role. */
export function useOrgPortal() {
  const { user } = useAuth();
  const role = (user?.role || "").toUpperCase();
  const isGovernment = role === "GOVERNMENT";
  const isNgo = role === "NGO";

  return useMemo(
    () => ({
      role,
      isGovernment,
      isNgo,
      label: isGovernment ? "Government" : "NGO",
      roleLabel: isGovernment ? "Government Portal" : "NGO Portal",
      getStatistics: () =>
        isGovernment ? governmentService.getStatistics() : ngoService.getStatistics(),
      getDiseaseTrends: () =>
        isGovernment
          ? governmentService.getDiseaseTrends()
          : ngoService.getDiseaseTrends(),
      getFarms: (page: number, limit: number, province: string) =>
        isGovernment
          ? governmentService.getFarms(page, limit, province)
          : ngoService.getFarms(page, limit, province),
      getPredictions: (page = 1, limit = 20) =>
        isGovernment
          ? governmentService.getPredictions(page, limit)
          : ngoService.getPredictions(page, limit),
      exportReport: () =>
        isGovernment ? governmentService.exportReport() : ngoService.exportReport(),
      ngo: ngoService,
      government: governmentService,
    }),
    [isGovernment, isNgo, role],
  );
}

export function extractRows<T>(data: unknown, keys: string[]): T[] {
  if (Array.isArray(data)) return data as T[];
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value as T[];
  }
  return [];
}

export function num(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
}
