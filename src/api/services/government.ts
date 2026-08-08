import { api } from "../client";
import type {
  CreateAdvisoryDto,
  DiseaseTrendItem,
  GovernmentAdvisory,
  MessageResponse,
  OrgFarmSummary,
  OrgStatistics,
  RegionalStatRow,
  UpdateAdvisoryDto,
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

export const governmentService = {
  getStatistics: () => api.get<OrgStatistics>("/government/statistics"),

  getRegionalStatistics: () =>
    api.get<
      | { regions?: RegionalStatRow[]; items?: RegionalStatRow[]; data?: RegionalStatRow[] }
      | RegionalStatRow[]
    >("/government/statistics/regional"),

  getDiseaseTrends: () =>
    api.get<
      | { trends?: DiseaseTrendItem[]; items?: DiseaseTrendItem[]; data?: DiseaseTrendItem[] }
      | DiseaseTrendItem[]
    >("/government/disease-trends"),

  getFarms: (page = 1, limit = 20, province: string) =>
    api.get<{ farms?: OrgFarmSummary[]; items?: OrgFarmSummary[]; data?: OrgFarmSummary[] }>(
      `/government/farms${buildQuery({ page, limit, province })}`,
    ),

  getPredictions: (page = 1, limit = 20) =>
    api.get(`/government/predictions${buildQuery({ page, limit })}`),

  getAdvisories: (regions: string) =>
    api.get<
      | { advisories?: GovernmentAdvisory[]; items?: GovernmentAdvisory[]; data?: GovernmentAdvisory[] }
      | GovernmentAdvisory[]
    >(`/government/advisories${buildQuery({ regions })}`),

  createAdvisory: (dto: CreateAdvisoryDto) =>
    api.post<GovernmentAdvisory | MessageResponse>("/government/advisories", dto),

  updateAdvisory: (id: string, dto: UpdateAdvisoryDto) =>
    api.put<GovernmentAdvisory | MessageResponse>(`/government/advisories/${id}`, dto),

  exportReport: () => api.get<Blob | Record<string, unknown>>("/government/reports/export"),
};
