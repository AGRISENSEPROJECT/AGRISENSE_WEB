// Types generated from the Agrisense OpenAPI spec.
// The API base URL is configured via VITE_API_BASE_URL (see .env.example);
// the interactive docs are served at `${VITE_API_BASE_URL}/api/docs`.

export type SoilType = "clay" | "sandy" | "loamy" | "silty" | "peaty" | "chalky";

export type RecommendationType =
  | "crop"
  | "fertilizer"
  | "irrigation"
  | "disease"
  | "weather"
  | "general";

export type PredictionSource = "manual" | "image";

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  isEmailVerified?: boolean;
  provider?: string;
  phoneNumber?: string;
  profileImage?: string | null;
  farmsCount?: number;
  hasFarm?: boolean;
  createdAt?: string;
  farm?: Farm | null;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  user: AuthUser;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  user: AuthUser;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface VerifyResetOtpDto {
  email: string;
  otp: string;
}

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UpdateProfileDto {
  username?: string;
  phoneNumber?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: string;
}

export interface MessageResponse {
  message: string;
}

// ---------------------------------------------------------------------------
// Farm management
// ---------------------------------------------------------------------------

export interface Farm {
  id: string;
  name: string;
  size: number;
  soilType: SoilType | string;
  country: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFarmDto {
  name: string;
  size: number;
  soilType: SoilType;
  country: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  ownerName: string;
  ownerPhone?: string;
  ownerEmail: string;
}

export type UpdateFarmDto = Partial<CreateFarmDto>;

export interface FarmListResponse {
  count: number;
  farms: Farm[];
}

export interface CreateFarmResponse {
  message: string;
  farm: Farm;
}

// ---------------------------------------------------------------------------
// Community
// ---------------------------------------------------------------------------

export interface PostAuthor {
  id: string;
  username: string;
  email?: string;
}

export interface PostLike {
  id: string;
  user: PostAuthor;
}

export interface PostComment {
  id: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityPost {
  id: string;
  description: string;
  imageUrl?: string | null;
  author: PostAuthor;
  likes: PostLike[];
  comments: PostComment[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostDto {
  description: string;
  imageUrl?: string;
}

export interface CreateCommentDto {
  content: string;
}

// ---------------------------------------------------------------------------
// Predictions
// ---------------------------------------------------------------------------

export interface CreatePredictionDto {
  image: File;
  farmId: string;
  source?: PredictionSource;
  rawImageUrl?: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  crop_type?: string;
  soil_moisture?: number;
  lat?: number;
  lon?: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilType?: string;
  phLevel?: number;
  organicLevels?: number;
  soilColor?: string;
  soilStructure?: string;
  propertyRates?: Record<string, unknown>;
  npkRates?: Record<string, unknown>;
  modelName?: string;
  modelVersion?: string;
  metadata?: Record<string, unknown>;
}

export interface Recommendation {
  id: string;
  type: RecommendationType | string;
  title?: string;
  description?: string;
  content?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface PredictionRun {
  id: string;
  farmId?: string;
  createdAt?: string;
  recommendations?: Recommendation[];
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  data?: T[];
  items?: T[];
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

// Dashboard shape is loosely typed since the backend returns a rich object.
export interface DashboardData {
  latest?: Record<string, unknown> | null;
  soilComposition?: Record<string, unknown> | null;
  history?: unknown[];
  trends?: unknown[];
  suggestions?: unknown[];
  runs?: PredictionRun[];
  [key: string]: unknown;
}
