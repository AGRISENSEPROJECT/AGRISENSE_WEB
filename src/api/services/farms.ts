import { api } from "../client";
import type {
  CreateFarmDto,
  CreateFarmResponse,
  Farm,
  FarmListResponse,
  MessageResponse,
  UpdateFarmDto,
} from "../types";

export const farmService = {
  create: (dto: CreateFarmDto) =>
    api.post<CreateFarmResponse>("/farms", dto),

  getAll: () => api.get<FarmListResponse>("/farms"),

  getById: (farmId: string) => api.get<Farm>(`/farms/${farmId}`),

  update: (farmId: string, dto: UpdateFarmDto) =>
    api.put<CreateFarmResponse>(`/farms/${farmId}`, dto),

  remove: (farmId: string) =>
    api.delete<MessageResponse>(`/farms/${farmId}`),
};
