import { api } from "../client";
import type {
  AdminAuditLog,
  AdminFarmStatistics,
  AdminReportItem,
  AdminUserRole,
  AdminUserSummary,
  AdminUsersResponse,
  AdminUserStatus,
  ApprovalDto,
  BroadcastDto,
  CreateAdminUserDto,
  FarmListResponse,
  MessageResponse,
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

export const adminService = {
  createUser: (dto: CreateAdminUserDto) =>
    api.post<MessageResponse>("/admin/users", dto),

  getUsers: (
    params: {
      page?: number;
      limit?: number;
      role?: AdminUserRole;
      status?: AdminUserStatus;
      search?: string;
    } = {},
  ) => api.get<AdminUsersResponse>(`/admin/users${buildQuery(params)}`),

  getUserById: (id: string) =>
    api.get<AdminUserSummary>(`/admin/users/${id}`),

  getFarmStatistics: () => api.get<AdminFarmStatistics>("/admin/statistics/farms"),

  getAllFarms: (page = 1, limit = 50) =>
    api.get<FarmListResponse>(`/admin/farms${buildQuery({ page, limit })}`),

  updateUserStatus: (id: string, status: Exclude<AdminUserStatus, "PENDING">) =>
    api.put<MessageResponse>(`/admin/users/${id}/status`, { status }),

  updateUserRole: (id: string, role: AdminUserRole) =>
    api.put<MessageResponse>(`/admin/users/${id}/role`, { role }),

  assignRegions: (id: string, regions: string[]) =>
    api.put<MessageResponse>(`/admin/users/${id}/regions`, { regions }),

  softDeleteUser: (id: string) =>
    api.delete<MessageResponse>(`/admin/users/${id}`),

  restoreUser: (id: string) =>
    api.put<MessageResponse>(`/admin/users/${id}/restore`, {}),

  approveSupplier: (id: string) =>
    api.put<MessageResponse>(`/admin/suppliers/${id}/approve`, {}),

  rejectSupplier: (id: string, dto: ApprovalDto = {}) =>
    api.put<MessageResponse>(`/admin/suppliers/${id}/reject`, dto),

  getPendingSuppliers: () =>
    api.get<{ data?: AdminUserSummary[]; items?: AdminUserSummary[]; suppliers?: AdminUserSummary[] }>(
      "/admin/suppliers/pending",
    ),

  approveNgo: (id: string) =>
    api.put<MessageResponse>(`/admin/ngos/${id}/approve`, {}),

  rejectNgo: (id: string, dto: ApprovalDto = {}) =>
    api.put<MessageResponse>(`/admin/ngos/${id}/reject`, dto),

  getPendingNgos: () =>
    api.get<{ data?: AdminUserSummary[]; items?: AdminUserSummary[]; ngos?: AdminUserSummary[] }>(
      "/admin/ngos/pending",
    ),

  getReports: (page = 1, limit = 20) =>
    api.get<{ data?: AdminReportItem[]; items?: AdminReportItem[]; reports?: AdminReportItem[] }>(
      `/community/reports?page=${page}&limit=${limit}`,
    ),

  moderateReportedPost: (postId: string) =>
    api.post<MessageResponse>(`/community/posts/${postId}/moderate`, {}),

  broadcastAnnouncement: (dto: BroadcastDto) =>
    api.post<MessageResponse>("/admin/announcements", dto),

  getAuditLogs: (page = 1, limit = 20, action?: string) =>
    api.get<{ data?: AdminAuditLog[]; items?: AdminAuditLog[]; logs?: AdminAuditLog[] }>(
      `/admin/audit-logs${buildQuery({ page, limit, action })}`,
    ),
};
