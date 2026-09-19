import {
  apiRequest,
  AUTH_API_PATHS,
  SKIP_ACCESS_TOKEN_HEADER,
  SKIP_UNAUTHORIZED_HANDLER_HEADER,
} from '@jujistu/shared/services/api';

import type {
  AuthSession,
  LoginCredentials,
  OtpChallenge,
  RegisterPayload,
  RequestOtpPayload,
  TokenResponse,
  UserProfile,
  VerifyOtpPayload,
} from '../types/auth.types';
import {
  parseAuthSessionResponse,
  parseOtpChallengeResponse,
  parseTokenData,
  parseUserProfile,
} from './auth-api.types';

export interface ServiceRequestOptions {
  signal?: AbortSignal;
}

/**
 * Request an OTP code sent to the specified email address.
 */
export async function requestOtp(
  payload: RequestOtpPayload,
  options?: ServiceRequestOptions,
): Promise<OtpChallenge> {
  const response = await apiRequest<unknown>(AUTH_API_PATHS.requestOtp, {
    method: 'POST',
    body: { email: payload.email },
    headers: {
      [SKIP_ACCESS_TOKEN_HEADER]: 'true',
    },
    signal: options?.signal,
  });

  return parseOtpChallengeResponse(response);
}

/**
 * Verify submitted OTP code against challenge ID and establish session.
 */
export async function verifyOtp(
  payload: VerifyOtpPayload,
  options?: ServiceRequestOptions,
): Promise<AuthSession> {
  const response = await apiRequest<unknown>(AUTH_API_PATHS.verifyOtp, {
    method: 'POST',
    body: {
      challenge_id: payload.challengeId,
      code: payload.code,
      email: payload.email,
    },
    headers: {
      [SKIP_ACCESS_TOKEN_HEADER]: 'true',
    },
    signal: options?.signal,
  });

  return parseAuthSessionResponse(response);
}

/**
 * Exchange a valid refresh token for a fresh token pair.
 * Skips authorization header and 401 interceptor loop.
 */
export async function refreshSession(
  refreshToken: string,
  options?: ServiceRequestOptions,
): Promise<TokenResponse> {
  const response = await apiRequest<unknown>(AUTH_API_PATHS.refreshToken, {
    method: 'POST',
    body: { refresh_token: refreshToken },
    headers: {
      [SKIP_ACCESS_TOKEN_HEADER]: 'true',
      [SKIP_UNAUTHORIZED_HANDLER_HEADER]: 'true',
    },
    signal: options?.signal,
  });

  return parseTokenData(response);
}

/**
 * Fetch the authenticated user's profile.
 */
export async function getCurrentUser(
  options?: ServiceRequestOptions,
): Promise<UserProfile> {
  const response = await apiRequest<unknown>(AUTH_API_PATHS.me, {
    method: 'GET',
    signal: options?.signal,
  });

  return parseUserProfile(response);
}

/**
 * Revoke the current authenticated session on the server.
 */
export async function logout(options?: ServiceRequestOptions): Promise<void> {
  await apiRequest<void>(AUTH_API_PATHS.logout, {
    method: 'POST',
    signal: options?.signal,
  });
}

/**
 * Password login endpoint (scoped if retained).
 */
export async function login(
  credentials: LoginCredentials,
  options?: ServiceRequestOptions,
): Promise<AuthSession> {
  const response = await apiRequest<unknown>(AUTH_API_PATHS.login, {
    method: 'POST',
    body: credentials,
    headers: {
      [SKIP_ACCESS_TOKEN_HEADER]: 'true',
    },
    signal: options?.signal,
  });

  return parseAuthSessionResponse(response);
}

/**
 * User registration endpoint (scoped if retained).
 */
export async function register(
  payload: RegisterPayload,
  options?: ServiceRequestOptions,
): Promise<AuthSession> {
  const response = await apiRequest<unknown>(AUTH_API_PATHS.register, {
    method: 'POST',
    body: payload,
    headers: {
      [SKIP_ACCESS_TOKEN_HEADER]: 'true',
    },
    signal: options?.signal,
  });

  return parseAuthSessionResponse(response);
}

export const authService = {
  requestOtp,
  verifyOtp,
  refreshSession,
  getCurrentUser,
  logout,
  login,
  register,
};
