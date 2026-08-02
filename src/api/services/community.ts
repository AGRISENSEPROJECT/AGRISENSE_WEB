import { api } from "../client";
import type {
  CommunityPost,
  CreateCommentDto,
  CreatePostDto,
  PostComment,
  PostLike,
} from "../types";

export const communityService = {
  getPosts: () => api.get<CommunityPost[]>("/community/posts"),

  createPost: (dto: CreatePostDto) =>
    api.post<CommunityPost>("/community/posts", dto),

  toggleLike: (postId: string) =>
    api.post<PostLike>(`/community/posts/${postId}/like`),

  addComment: (postId: string, dto: CreateCommentDto) =>
    api.post<PostComment>(`/community/posts/${postId}/comment`, dto),
};
