import { appConfig } from '@jujistu/shared/config/appConfig';

/**
 * Resolve the API base URL for the current environment.
 *
 * Returns `null` when the backend URL has not been configured yet.
 * Callers must handle the `null` case explicitly rather than defaulting
 * to an invented URL.
 */
export function getApiBaseUrl(): string | null {
  return appConfig.apiBaseUrl;
}

/**
 * Default request timeout in milliseconds.
 *
 * Mobile connections are less reliable than desktop; 30 seconds gives
 * slow cellular networks a reasonable window without making the user
 * wait indefinitely.
 */
export const API_TIMEOUT_MS = 30_000;
