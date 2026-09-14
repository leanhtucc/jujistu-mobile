import { apiClient } from '@jujistu/shared/services/api';

import type {
  AuthSession,
  LoginCredentials,
  RegisterPayload,
  TokenResponse,
  UserProfile,
} from '../types/auth.types';

/**
 * Authentication API module.
 *
 * NOTE: Endpoint paths and payload structures below represent standard REST conventions.
 * TODO(BLOCKED): Confirm exact endpoint paths, HTTP methods, and payload envelopes
 * against the backend OpenAPI/Swagger specification once available.
 */
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthSession> => {
    return apiClient.post<AuthSession>('/auth/login', credentials, {
      skipAuth: true,
    });
  },

  register: async (payload: RegisterPayload): Promise<AuthSession> => {
    return apiClient.post<AuthSession>('/auth/register', payload, {
      skipAuth: true,
    });
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    return apiClient.post<TokenResponse>(
      '/auth/refresh',
      { refreshToken },
      { skipAuth: true },
    );
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/auth/me');
  },

  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },
};
