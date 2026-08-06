import { api } from "../client";
import type {
  AdminReportItem,
  CommunityPost,
  CreateCommentDto,
  CreatePostDto,
  MessageResponse,
  PostComment,
  PostLike,
} from "../types";

export const communityService = {
  getPosts: () => api.get<CommunityPost[]>("/community/posts"),

  createPost: (dto: CreatePostDto) => {
    const form = new FormData();
    form.append("title", dto.title || dto.description.slice(0, 60));
    form.append("description", dto.description);
    if (dto.image) form.append("image", dto.image);
    return api.post<CommunityPost>("/community/posts", form);
  },

  updatePost: (postId: string, dto: CreatePostDto) => {
    const form = new FormData();
    form.append("title", dto.title || dto.description.slice(0, 60));
    form.append("description", dto.description);
    if (dto.image) form.append("image", dto.image);
    return api.patch<CommunityPost>(`/community/posts/${postId}`, form);
  },

  deletePost: (postId: string) =>
    api.delete<MessageResponse>(`/community/posts/${postId}`),

  toggleLike: (postId: string) =>
    api.post<PostLike>(`/community/posts/${postId}/like`),

  addComment: (postId: string, dto: CreateCommentDto) =>
    api.post<PostComment>(`/community/posts/${postId}/comment`, dto),

  reportPost: (postId: string, dto: { reason: string; description?: string }) =>
    api.post<AdminReportItem>(`/community/posts/${postId}/report`, dto),

  getReports: (page = 1, limit = 20) =>
    api.get<{ data?: AdminReportItem[]; items?: AdminReportItem[]; reports?: AdminReportItem[] }>(
      `/community/reports?page=${page}&limit=${limit}`,
    ),

  moderatePost: (postId: string) =>
    api.post<MessageResponse>(`/community/posts/${postId}/moderate`, {}),
};
