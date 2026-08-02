import { api, tokenStore } from "../client";
import type {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  LoginResponse,
  MessageResponse,
  RegisterDto,
  RegisterResponse,
  ResetPasswordDto,
  UpdateProfileDto,
  AuthUser,
  VerifyOtpDto,
  VerifyOtpResponse,
  VerifyResetOtpDto,
} from "../types";

export const authService = {
  register: (dto: RegisterDto) =>
    api.post<RegisterResponse>("/auth/register", dto, { auth: false }),

  login: (dto: LoginDto) =>
    api.post<LoginResponse>("/auth/login", dto, { auth: false }),

  verifyOtp: (dto: VerifyOtpDto) =>
    api.post<VerifyOtpResponse>("/auth/verify-otp", dto, { auth: false }),

  resendOtp: (email: string) =>
    api.post<MessageResponse>("/auth/resend-otp", { email }, { auth: false }),

  forgotPassword: (dto: ForgotPasswordDto) =>
    api.post<MessageResponse>("/auth/forgot-password", dto, { auth: false }),

  verifyResetOtp: (dto: VerifyResetOtpDto) =>
    api.post<MessageResponse>("/auth/verify-reset-otp", dto, { auth: false }),

  resetPassword: (dto: ResetPasswordDto) =>
    api.post<MessageResponse>("/auth/reset-password", dto, { auth: false }),

  getProfile: () => api.get<{ user: AuthUser }>("/auth/profile"),

  updateProfile: (dto: UpdateProfileDto) =>
    api.put<{ message?: string; user?: AuthUser }>("/auth/profile", dto),

  uploadProfileImage: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post<{ message: string; profileImage: string }>(
      "/auth/profile/image",
      form,
    );
  },

  deleteProfileImage: () =>
    api.delete<MessageResponse>("/auth/profile/image"),

  changePassword: (dto: ChangePasswordDto) =>
    api.post<MessageResponse>("/auth/change-password", dto),

  logout: (refreshToken?: string) => {
    const token = tokenStore.getAccessToken() || "";
    return api.post<MessageResponse>(
      "/auth/logout",
      { refreshToken },
      { headers: { authorization: `Bearer ${token}` } },
    );
  },
};
