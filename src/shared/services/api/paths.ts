/**
 * Centralized API endpoint paths dictionary grouped by domain.
 *
 * All network routes in JUJISTU must be referenced from here
 * rather than writing hardcoded path strings in feature services.
 */

export const AUTH_API_PATHS = {
  requestOtp: '/api/auth/request-otp',
  verifyOtp: '/api/auth/verify-otp',
  login: '/api/auth/login',
  register: '/api/auth/register',
  refreshToken: '/api/auth/refresh-token',
  me: '/api/auth/me',
  logout: '/api/auth/logout',
  forgotPassword: '/api/auth/forgot-password',
} as const;

export const USER_API_PATHS = {
  profile: '/api/users/profile',
  updateProfile: '/api/users/profile',
} as const;

export const SYSTEM_API_PATHS = {
  appVersion: '/api/system/app-version',
} as const;
