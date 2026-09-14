import { createLogger } from '@jujistu/shared/logger/logger';

import { getApiBaseUrl, API_TIMEOUT_MS } from './api-config';
import { normalizeHttpError, normalizeNetworkError } from './api-error';
import { tokenManager } from './token-manager';

const log = createLogger('ApiClient');

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  /** Skip Authorization header injection for public endpoints. */
  skipAuth?: boolean;
  /** Custom headers merged with defaults. */
  headers?: Record<string, string>;
  /** AbortSignal for request cancellation. */
  signal?: AbortSignal;
  /** Override default timeout (ms). */
  timeoutMs?: number;
}

/**
 * Typed fetch wrapper for the JUJISTU API.
 *
 * Responsibilities:
 * - Base URL resolution from environment config
 * - Authorization header injection via tokenManager
 * - Request timeout via AbortController
 * - Error normalization to AppError hierarchy
 * - Development-safe request logging (redacted by logger)
 *
 * This client does NOT handle 401 refresh — that is coordinated by
 * feature-level mutation hooks calling refreshAccessToken().
 *
 * TODO: Add 401 interceptor with refresh retry when auth flow is wired — Phase 6
 */
async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl();

  if (baseUrl === null) {
    throw new Error(
      'API base URL is not configured. Set apiBaseUrl in appConfig for the current environment.',
    );
  }

  const url = `${baseUrl}${path}`;
  const timeoutMs = options.timeoutMs ?? API_TIMEOUT_MS;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  if (!options.skipAuth) {
    const accessToken = await tokenManager.getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const signal = options.signal
    ? combineAbortSignals(options.signal, controller.signal)
    : controller.signal;

  log.debug(`${method} ${path}`);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let responseBody: unknown;
      try {
        responseBody = await response.json();
      } catch {
        responseBody = null;
      }
      throw normalizeHttpError(response.status, responseBody);
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // Re-throw already-normalized AppErrors
    if (error instanceof Error && 'code' in error) {
      throw error;
    }

    throw normalizeNetworkError(error);
  }
}

function combineAbortSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
    signal.addEventListener('abort', () => controller.abort(signal.reason), {
      once: true,
    });
  }

  return controller.signal;
}

/**
 * Shared API client.
 *
 * Feature API modules call these methods to communicate with the backend.
 * Business-specific endpoints must NOT be added here — they belong in
 * feature-level API modules (e.g., `features/auth/api/auth.api.ts`).
 */
export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
};
