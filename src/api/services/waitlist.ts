import { api } from "../client";
import type {
  JoinWaitlistDto,
  MessageResponse,
  WaitlistEntry,
  WaitlistListResponse,
  WaitlistStats,
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

export const waitlistService = {
  join: (dto: JoinWaitlistDto) =>
    api.post<MessageResponse>("/waitlist", dto, { auth: false }),

  list: (params: { page?: number; limit?: number; search?: string } = {}) =>
    api.get<WaitlistListResponse>(`/waitlist${buildQuery(params)}`),

  stats: () => api.get<WaitlistStats>("/waitlist/stats"),

  getById: (id: string) => api.get<WaitlistEntry>(`/waitlist/${id}`),

  resendEmail: (id: string) =>
    api.post<MessageResponse>(`/waitlist/${id}/resend-email`, {}),

  deactivate: (id: string) =>
    api.put<MessageResponse>(`/waitlist/${id}/deactivate`, {}),
};
