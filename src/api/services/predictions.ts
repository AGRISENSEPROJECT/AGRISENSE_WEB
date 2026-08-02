import { api } from "../client";
import type {
  CreatePredictionDto,
  DashboardData,
  PaginatedResponse,
  PredictionRun,
  Recommendation,
  RecommendationType,
} from "../types";

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const predictionService = {
  run: (dto: CreatePredictionDto) => {
    const form = new FormData();
    Object.entries(dto).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (value instanceof File) {
        form.append(key, value);
      } else if (typeof value === "object") {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, String(value));
      }
    });
    return api.post<PredictionRun>("/predictions/run", form);
  },

  getDashboard: (params: { farmId?: string; limit?: number } = {}) =>
    api.get<DashboardData>(`/predictions/dashboard${buildQuery(params)}`),

  getRecommendations: (
    params: {
      farmId?: string;
      page?: number;
      limit?: number;
      type?: RecommendationType;
    } = {},
  ) =>
    api.get<PaginatedResponse<Recommendation>>(
      `/predictions/recommendations${buildQuery(params)}`,
    ),

  getRuns: (params: { farmId?: string; page?: number; limit?: number } = {}) =>
    api.get<PaginatedResponse<PredictionRun>>(
      `/predictions/runs${buildQuery(params)}`,
    ),

  getRun: (id: string) => api.get<PredictionRun>(`/predictions/runs/${id}`),
};
