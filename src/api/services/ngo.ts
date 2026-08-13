import { api } from "../client";
import type {
  CreateProgramDto,
  DiseaseTrendItem,
  MessageResponse,
  NgoProfile,
  NgoProgram,
  OrgFarmSummary,
  OrgFarmerSummary,
  OrgStatistics,
  SendOrgNotificationDto,
  UpdateNgoProfileDto,
  UpdateProgramDto,
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

export const ngoService = {
  getProfile: () => api.get<NgoProfile>("/ngo/profile"),

  updateProfile: (dto: UpdateNgoProfileDto) =>
    api.put<NgoProfile | MessageResponse>("/ngo/profile", dto),

  getStatistics: () => api.get<OrgStatistics>("/ngo/statistics"),

  getPrograms: () =>
    api.get<{ programs?: NgoProgram[]; items?: NgoProgram[]; data?: NgoProgram[] } | NgoProgram[]>(
      "/ngo/programs",
    ),

  createProgram: (dto: CreateProgramDto) =>
    api.post<NgoProgram | MessageResponse>("/ngo/programs", dto),

  updateProgram: (id: string, dto: UpdateProgramDto) =>
    api.put<NgoProgram | MessageResponse>(`/ngo/programs/${id}`, dto),

  getFarmers: (page = 1, limit = 20) =>
    api.get<{ farmers?: OrgFarmerSummary[]; items?: OrgFarmerSummary[]; data?: OrgFarmerSummary[] }>(
      `/ngo/farmers${buildQuery({ page, limit })}`,
    ),

  getFarms: (page = 1, limit = 20, province: string) =>
    api.get<{ farms?: OrgFarmSummary[]; items?: OrgFarmSummary[]; data?: OrgFarmSummary[] }>(
      `/ngo/farms${buildQuery({ page, limit, province })}`,
    ),

  getDiseaseTrends: () =>
    api.get<{ trends?: DiseaseTrendItem[]; items?: DiseaseTrendItem[]; data?: DiseaseTrendItem[] } | DiseaseTrendItem[]>(
      "/ngo/disease-trends",
    ),

  getPredictions: (page = 1, limit = 20) =>
    api.get(`/ngo/predictions${buildQuery({ page, limit })}`),

  sendNotification: (dto: SendOrgNotificationDto = {}) =>
    api.post<MessageResponse>("/ngo/notifications", dto),

  exportReport: () => api.get<Blob | Record<string, unknown>>("/ngo/reports/export"),
};
