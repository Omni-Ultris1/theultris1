// ============================================================
// ULTRIS 1 — TypeScript Types
// ============================================================

export type UserTier = 'free' | 'coss' | 'elite' | 'founder';
export type UserRole = 'user' | 'admin' | 'superadmin';
export type ToolCategory = 'ai' | 'analytics' | 'communication' | 'productivity' | 'research' | 'finance';

export interface UserProfile {
  displayName?: string;
  bio?: string;
  avatar?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  tier: UserTier;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  profile?: UserProfile;
  lastLogin?: string;
  loginCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  description: string;
  category: ToolCategory;
  icon?: string;
  coverImage?: string;
  requiredTier: UserTier;
  isActive: boolean;
  isFeatured: boolean;
  version: string;
  usageCount: number;
  avgRating: number;
  tags: string[];
  hasAccess?: boolean;
}

export interface Tier {
  id: string;
  name: UserTier;
  displayName: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'annually' | 'lifetime';
  features: string[];
  toolAccess: string[];
  maxToolsPerDay: number;
  apiCallsPerMonth: number;
  isActive: boolean;
  sortOrder: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> extends ApiResponse<{ items: T[]; pagination: Pagination }> {
  data: {
    items: T[];
    pagination: Pagination;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
