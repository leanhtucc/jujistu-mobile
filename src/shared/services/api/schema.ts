/**
 * Shared API DTOs, data transfer models, and standard backend envelope.
 */

export type ApiEnvelope<TData = unknown> = {
  data?: TData;
  message: string;
  status: number;
  success: boolean;
};

export type AuthTokenDataApi = {
  access_token: string;
  refresh_token: string;
  expire_in?: number;
  auth_type?: string;
};

export type UserProfileDataApi = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthLoginRequestApi = {
  email: string;
  password: string;
};

export type AuthRegisterRequestApi = {
  email: string;
  password: string;
  displayName: string;
};

export type AuthRefreshTokenRequestApi = {
  refresh_token: string;
};
