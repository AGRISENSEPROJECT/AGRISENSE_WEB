import { api } from "../client";
import type {
  CreateFarmCropDto,
  CreateFarmDto,
  CreateFarmResponse,
  Farm,
  FarmCrop,
  FarmListResponse,
  MessageResponse,
  UpdateFarmCropDto,
  UpdateFarmDto,
} from "../types";

export const farmService = {
  create: (dto: CreateFarmDto) =>
    api.post<CreateFarmResponse>("/farms", dto),

  getAll: () => api.get<FarmListResponse>("/farms"),

  getById: (farmId: string) => api.get<Farm>(`/farms/${farmId}`),

  update: (farmId: string, dto: UpdateFarmDto) =>
    api.put<CreateFarmResponse>(`/farms/${farmId}`, dto),

  archive: (farmId: string) =>
    api.put<MessageResponse>(`/farms/${farmId}/archive`, {}),

  restore: (farmId: string) =>
    api.put<MessageResponse>(`/farms/${farmId}/restore`, {}),

  setActive: (farmId: string) =>
    api.put<MessageResponse>(`/farms/${farmId}/active`, {}),

  getArchived: () => api.get<FarmListResponse>("/farms/archived/list"),

  uploadImage: (farmId: string, file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post<MessageResponse>(`/farms/${farmId}/image`, form);
  },

  getCrops: (farmId: string) => api.get<FarmCrop[]>(`/farms/${farmId}/crops`),

  createCrop: (farmId: string, dto: CreateFarmCropDto) =>
    api.post<FarmCrop>(`/farms/${farmId}/crops`, dto),

  updateCrop: (farmId: string, cropId: string, dto: UpdateFarmCropDto) =>
    api.put<FarmCrop>(`/farms/${farmId}/crops/${cropId}`, dto),

  removeCrop: (farmId: string, cropId: string) =>
    api.delete<MessageResponse>(`/farms/${farmId}/crops/${cropId}`),

  remove: (farmId: string) =>
    api.delete<MessageResponse>(`/farms/${farmId}`),
};
