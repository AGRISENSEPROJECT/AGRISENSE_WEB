import { api } from "../client";
import type {
  ChatMessage,
  ChatMessagesResponse,
  ChatUserSummary,
  Conversation,
  ConversationsResponse,
  CreateDirectConversationDto,
  CreateGroupConversationDto,
  GroupMembersDto,
  MessageResponse,
  MuteConversationDto,
  SendMessageDto,
  UpdateGroupDto,
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

export function unwrapConversations(payload: unknown): Conversation[] {
  if (Array.isArray(payload)) return payload as Conversation[];
  if (!payload || typeof payload !== "object") return [];
  const record = payload as ConversationsResponse;
  const rows = record.conversations ?? record.items ?? record.data;
  return Array.isArray(rows) ? rows : [];
}

export function unwrapMessages(payload: unknown): ChatMessage[] {
  if (Array.isArray(payload)) return payload as ChatMessage[];
  if (!payload || typeof payload !== "object") return [];
  const record = payload as ChatMessagesResponse;
  const rows = record.messages ?? record.items ?? record.data;
  return Array.isArray(rows) ? rows : [];
}

export function unwrapUsers(payload: unknown): ChatUserSummary[] {
  if (Array.isArray(payload)) return payload as ChatUserSummary[];
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  const rows = record.users ?? record.items ?? record.data;
  return Array.isArray(rows) ? (rows as ChatUserSummary[]) : [];
}

export function unwrapConversation(payload: unknown): Conversation | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  if (record.conversation && typeof record.conversation === "object") {
    return record.conversation as Conversation;
  }
  if ("id" in record) return payload as Conversation;
  return null;
}

export const chatService = {
  listConversations: (type?: "direct" | "group") =>
    api.get<ConversationsResponse | Conversation[]>(
      `/community/conversations${buildQuery({ type })}`,
    ),

  getConversation: (id: string) =>
    api.get<Conversation | { conversation?: Conversation }>(`/community/conversations/${id}`),

  createDirect: (dto: CreateDirectConversationDto) =>
    api.post<Conversation | { conversation?: Conversation }>(
      "/community/conversations/direct",
      dto,
    ),

  createGroup: (dto: CreateGroupConversationDto) =>
    api.post<Conversation | { conversation?: Conversation }>(
      "/community/conversations/group",
      dto,
    ),

  renameGroup: (id: string, dto: UpdateGroupDto) =>
    api.patch<Conversation | { conversation?: Conversation }>(
      `/community/conversations/${id}`,
      dto,
    ),

  deleteGroup: (id: string) =>
    api.delete<MessageResponse>(`/community/conversations/${id}`),

  uploadGroupImage: (id: string, file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post<Conversation | { conversation?: Conversation; imageUrl?: string }>(
      `/community/conversations/${id}/image`,
      form,
    );
  },

  addMembers: (id: string, dto: GroupMembersDto) =>
    api.post<Conversation | MessageResponse>(`/community/conversations/${id}/members`, dto),

  removeMembers: (id: string, dto: GroupMembersDto) =>
    api.delete<Conversation | MessageResponse>(`/community/conversations/${id}/members`, dto),

  leave: (id: string) =>
    api.post<MessageResponse>(`/community/conversations/${id}/leave`, {}),

  mute: (id: string, dto: MuteConversationDto = { muted: true }) =>
    api.post<MessageResponse>(`/community/conversations/${id}/mute`, dto),

  getMessages: (id: string, params: { page?: number; limit?: number } = {}) =>
    api.get<ChatMessagesResponse | ChatMessage[]>(
      `/community/conversations/${id}/messages${buildQuery(params)}`,
    ),

  sendMessage: (id: string, dto: SendMessageDto) =>
    api.post<ChatMessage | { message?: ChatMessage }>(
      `/community/conversations/${id}/messages`,
      dto,
    ),

  updateMessage: (messageId: string, dto: SendMessageDto) =>
    api.patch<ChatMessage>(`/community/messages/${messageId}`, dto),

  deleteMessage: (messageId: string) =>
    api.delete<MessageResponse>(`/community/messages/${messageId}`),

  markRead: (id: string) =>
    api.post<MessageResponse>(`/community/conversations/${id}/read`, {}),

  searchUsers: (q = "") =>
    api.get<ChatUserSummary[] | { users?: ChatUserSummary[] }>(
      `/community/users${buildQuery({ q })}`,
    ),

  listBlocks: () => api.get<unknown>("/community/blocks"),

  blockUser: (userId: string) =>
    api.post<MessageResponse>("/community/blocks", { userId }),

  unblockUser: (userId: string) =>
    api.delete<MessageResponse>(`/community/blocks/${userId}`),
};
