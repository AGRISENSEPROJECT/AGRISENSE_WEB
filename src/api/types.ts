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
  firstName?: string;
  lastName?: string;
  username?: string;
  isEmailVerified?: boolean;
  provider?: string;
  phoneNumber?: string;
  profileImage?: string | null;
  farmsCount?: number;
  hasFarm?: boolean;
  nationalId?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  farm?: Farm | null;
}

export interface RegisterDto {
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface LoginDto {
  email?: string;
  phoneNumber?: string;
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
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
}

export interface IdentityVerificationDto {
  nationalId: string;
  documentType: "NATIONAL_ID" | string;
  idImageUrl?: string;
}

export interface OnboardingFarmDto {
  name: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  size: number;
  soilType: SoilType | string;
  latitude?: number;
  longitude?: number;
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
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
  isArchived?: boolean;
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

export type FarmCropStatus =
  | "PLANNED"
  | "PLANTED"
  | "GROWING"
  | "READY_FOR_HARVEST"
  | "HARVESTED";

export interface FarmCrop {
  id: string;
  cropType: string;
  variety?: string;
  plantingSeason?: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  harvestSeason?: string;
  status?: FarmCropStatus | string;
  estimatedYield?: number;
  areaPlanted?: number;
  [key: string]: unknown;
}

export interface CreateFarmCropDto {
  cropType: string;
  variety?: string;
  plantingSeason?: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  harvestSeason?: string;
  status?: FarmCropStatus | string;
  estimatedYield?: number;
  areaPlanted?: number;
}

export interface UpdateFarmCropDto extends Partial<CreateFarmCropDto> {}

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
  username?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  deleted?: boolean;
  banned?: boolean;
  status?: string;
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
  title?: string;
  description: string;
  imageUrl?: string | null;
  author: PostAuthor;
  likes: PostLike[];
  comments: PostComment[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostDto {
  title?: string;
  description: string;
  image?: File;
}

export interface CreateCommentDto {
  content: string;
  parentId?: string;
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

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export interface NotificationItem {
  id: string;
  title?: string;
  message?: string;
  content?: string;
  type?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

export interface NotificationListResponse extends PaginatedResponse<NotificationItem> {
  notifications?: NotificationItem[];
}

// ---------------------------------------------------------------------------
// Marketplace
// ---------------------------------------------------------------------------

export interface MarketplaceProduct {
  id: string;
  name: string;
  description?: string;
  price?: number;
  unit?: string;
  category?: string;
  imageUrl?: string;
  stock?: number;
  supplier?: {
    id?: string;
    businessName?: string;
    name?: string;
  };
  [key: string]: unknown;
}

export interface MarketplaceProductsResponse extends PaginatedResponse<MarketplaceProduct> {
  products?: MarketplaceProduct[];
}

export interface MarketplaceOrder {
  id: string;
  status?: string;
  quantity?: number;
  totalAmount?: number;
  notes?: string;
  createdAt?: string;
  product?: MarketplaceProduct;
  [key: string]: unknown;
}

export interface MarketplaceOrdersResponse extends PaginatedResponse<MarketplaceOrder> {
  orders?: MarketplaceOrder[];
}

export interface CreateMarketplaceOrderDto {
  productId: string;
  quantity: number;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export type AdminUserRole = "FARMER" | "SUPPLIER" | "ADMIN" | "NGO" | "GOVERNMENT";
export type AdminUserStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED";

export interface AdminUserSummary {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: AdminUserRole | string;
  status?: AdminUserStatus | string;
  createdAt?: string;
  deletedAt?: string | null;
  [key: string]: unknown;
}

export interface AdminUsersResponse extends PaginatedResponse<AdminUserSummary> {
  users?: AdminUserSummary[];
}

export interface CreateAdminUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: AdminUserRole;
  phoneNumber?: string;
  assignedRegions?: string[];
}

export interface AdminFarmStatistics {
  totalFarms?: number;
  averageFarmSize?: number;
  activeFarms?: number;
  archivedFarms?: number;
  byProvince?: Array<{ name?: string; province?: string; value?: number; count?: number }>;
  [key: string]: unknown;
}

export interface AdminReportItem {
  id: string;
  reason?: string;
  description?: string;
  status?: string;
  postId?: string;
  excerpt?: string;
  createdAt?: string;
  author?: PostAuthor;
  [key: string]: unknown;
}

export interface AdminAuditLog {
  id: string;
  action?: string;
  createdAt?: string;
  actor?: PostAuthor | null;
  targetUser?: AdminUserSummary | null;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ApprovalDto {
  reason?: string;
}

export interface BroadcastDto {
  title: string;
  message: string;
  /** Optional role audience; omit to broadcast to everyone. */
  targetRole?: AdminUserRole | string;
}

// ---------------------------------------------------------------------------
// Waitlist
// ---------------------------------------------------------------------------

export interface JoinWaitlistDto {
  email: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  isActive?: boolean;
  status?: string;
  emailSentAt?: string | null;
  createdAt?: string;
  deactivatedAt?: string | null;
  [key: string]: unknown;
}

export interface WaitlistStats {
  total?: number;
  active?: number;
  inactive?: number;
  emailsSent?: number;
  [key: string]: unknown;
}

export interface WaitlistListResponse extends PaginatedResponse<WaitlistEntry> {
  entries?: WaitlistEntry[];
  waitlist?: WaitlistEntry[];
}

export interface CreateOrgAccountDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  businessName?: string;
  organizationName?: string;
  autoApprove?: boolean;
}

export type ModeratePostAction = "hide" | "unhide" | "delete";

export interface ModeratePostDto {
  action: ModeratePostAction;
}

export interface AdminOverviewStatistics {
  totalUsers?: number;
  activeUsers?: number;
  suspendedUsers?: number;
  bannedUsers?: number;
  totalFarms?: number;
  pendingSuppliers?: number;
  pendingNgos?: number;
  waitlistTotal?: number;
  reportedPosts?: number;
  [key: string]: unknown;
}
