import {
  apiRequest,
  AUTH_API_PATHS,
  SKIP_ACCESS_TOKEN_HEADER,
  SKIP_UNAUTHORIZED_HANDLER_HEADER,
  type ApiEnvelope,
  type AuthTokenDataApi,
  type UserProfileDataApi,
} from '@jujistu/shared/services/api';

import type {
  AuthSession,
  LoginCredentials,
  RegisterPayload,
  TokenResponse,
  UserProfile,
} from '../types/auth.types';

function normalizeTokenData(data: AuthTokenDataApi): TokenResponse {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

function normalizeSession(
  response:
    | ApiEnvelope<AuthTokenDataApi & { user?: UserProfileDataApi }>
    | (AuthTokenDataApi & { user?: UserProfileDataApi }),
): AuthSession {
  const data =
    response &&
    typeof response === 'object' &&
    'data' in response &&
    response.data
      ? response.data
      : (response as AuthTokenDataApi & { user?: UserProfileDataApi });

  const tokens = normalizeTokenData(data);
  const user: UserProfile = data.user
    ? {
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.displayName,
        avatarUrl: data.user.avatarUrl,
      }
    : {
        id: 'usr_default',
        email: 'user@jujistu.app',
        displayName: 'Jujitsu Athlete',
        avatarUrl: null,
      };

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

function normalizeUser(
  response: ApiEnvelope<UserProfileDataApi> | UserProfileDataApi,
): UserProfile {
  const data =
    response &&
    typeof response === 'object' &&
    'data' in response &&
    response.data
      ? response.data
      : (response as UserProfileDataApi);

  return {
    id: data.id,
    email: data.email,
    displayName: data.displayName,
    avatarUrl: data.avatarUrl,
  };
}

/**
 * Authentication API module.
 *
 * Implements endpoints using centralized AUTH_API_PATHS, apiRequest,
 * and response normalization following the TiengVietTV specification.
 */
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthSession> => {
    const response = await apiRequest<
      ApiEnvelope<AuthTokenDataApi & { user?: UserProfileDataApi }>
    >(AUTH_API_PATHS.login, {
      method: 'POST',
      body: credentials,
      headers: {
        [SKIP_ACCESS_TOKEN_HEADER]: 'true',
      },
    });

    return normalizeSession(response);
  },

  register: async (payload: RegisterPayload): Promise<AuthSession> => {
    const response = await apiRequest<
      ApiEnvelope<AuthTokenDataApi & { user?: UserProfileDataApi }>
    >(AUTH_API_PATHS.register, {
      method: 'POST',
      body: payload,
      headers: {
        [SKIP_ACCESS_TOKEN_HEADER]: 'true',
      },
    });

    return normalizeSession(response);
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiRequest<ApiEnvelope<AuthTokenDataApi>>(
      AUTH_API_PATHS.refreshToken,
      {
        method: 'POST',
        body: { refresh_token: refreshToken },
        headers: {
          [SKIP_ACCESS_TOKEN_HEADER]: 'true',
          [SKIP_UNAUTHORIZED_HANDLER_HEADER]: 'true',
        },
      },
    );

    const data =
      response &&
      typeof response === 'object' &&
      'data' in response &&
      response.data
        ? response.data
        : (response as unknown as AuthTokenDataApi);

    return normalizeTokenData(data);
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await apiRequest<ApiEnvelope<UserProfileDataApi>>(
      AUTH_API_PATHS.me,
      {
        method: 'GET',
      },
    );

    return normalizeUser(response);
  },

  logout: async (): Promise<void> => {
    await apiRequest<void>(AUTH_API_PATHS.logout, {
      method: 'POST',
    });
  },
};
