import { appConfig } from '@jujistu/shared/config/appConfig';
import { createLogger } from '@jujistu/shared/logger/logger';

import { API_TIMEOUT_MS } from './api-config';
import { normalizeHttpError, normalizeNetworkError } from './api-error';
import { hasMockApiResponse, mockApiRequest } from './mock-api';
import { trackApiRequestActivity } from './request-activity';
import { tokenManager } from './token-manager';
import type { ApiRequestOptions } from './types';

const log = createLogger('HttpClient');

type AccessTokenProvider = () =>
  | string
  | null
  | undefined
  | Promise<string | null | undefined>;

type UnauthorizedHandlerResult = {
  retry: boolean;
};

type UnauthorizedHandler = (context: {
  body: unknown;
  method: string;
  status: number;
  url: string;
}) => UnauthorizedHandlerResult | Promise<UnauthorizedHandlerResult>;

let accessTokenProvider: AccessTokenProvider | null = async () =>
  tokenManager.getAccessToken();
let unauthorizedHandler: UnauthorizedHandler | null = null;

export const SKIP_ACCESS_TOKEN_HEADER = 'x-skip-access-token';
export const SKIP_UNAUTHORIZED_HANDLER_HEADER = 'x-skip-unauthorized-handler';

export function setApiAccessTokenProvider(
  provider: AccessTokenProvider | null,
): void {
  accessTokenProvider = provider;
}

export function setApiUnauthorizedHandler(
  handler: UnauthorizedHandler | null,
): void {
  unauthorizedHandler = handler;
}

export function getApiBaseUrl(): string {
  return (appConfig.apiBaseUrl ?? '').replace(/\/$/, '');
}

export function buildApiUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const getHeader = response.headers?.get?.bind(response.headers);
  const contentType = getHeader ? getHeader('content-type') ?? '' : '';

  if (
    contentType.includes('application/json') ||
    (!contentType && typeof response.json === 'function')
  ) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  if (typeof response.text === 'function') {
    const text = await response.text();
    return text.length > 0 ? text : null;
  }

  return null;
}

function sanitizeDebugHeaders(
  headers: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      key.toLowerCase() === 'authorization' ? 'Bearer [REDACTED]' : value,
    ]),
  );
}

function isFormDataBody(body: unknown): boolean {
  if (!body || typeof body !== 'object') {
    return false;
  }
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return true;
  }
  return body.constructor?.name === 'FormData' || '_parts' in body;
}

function combineAbortSignals(
  ...signals: (AbortSignal | undefined | null)[]
): AbortSignal {
  const controller = new AbortController();

  for (const signal of signals) {
    if (!signal) {
      continue;
    }
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

async function performApiFetch(
  path: string,
  options: ApiRequestOptions,
  retryOnUnauthorized: boolean,
): Promise<unknown> {
  const {
    trackActivity = true,
    timeoutMs = API_TIMEOUT_MS,
    signal: callerSignal,
    ...requestOptions
  } = options;
  const stopTrackingActivity = trackActivity
    ? trackApiRequestActivity()
    : undefined;

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort(
      new Error(`Request timed out after ${timeoutMs}ms`),
    );
  }, timeoutMs);

  const signal = callerSignal
    ? combineAbortSignals(callerSignal, timeoutController.signal)
    : timeoutController.signal;

  try {
    const baseUrl = getApiBaseUrl();

    // Fall back to mock response if baseUrl is not configured or in testing
    if (!baseUrl && !/^https?:\/\//.test(path) && hasMockApiResponse(path)) {
      const mockResponse = await mockApiRequest(path, options);
      log.debug(`[mock-response] ${options.method ?? 'GET'} ${path}`);
      return mockResponse;
    }

    const body = options.body;
    const isJsonBody =
      body !== undefined &&
      body !== null &&
      typeof body === 'object' &&
      !isFormDataBody(body);

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...options.headers,
    };

    const shouldSkipAccessToken =
      options.skipAuth === true || headers[SKIP_ACCESS_TOKEN_HEADER] === 'true';
    const shouldSkipUnauthorizedHandler =
      headers[SKIP_UNAUTHORIZED_HANDLER_HEADER] === 'true';

    const token = shouldSkipAccessToken ? null : await accessTokenProvider?.();

    if (isJsonBody && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    delete headers[SKIP_ACCESS_TOKEN_HEADER];
    delete headers[SKIP_UNAUTHORIZED_HANDLER_HEADER];

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const method = options.method ?? 'GET';
    const url = buildApiUrl(path);

    if (appConfig.enableDebugLogging) {
      log.debug(
        `[request] ${method} ${url}`,
        JSON.stringify(sanitizeDebugHeaders(headers)),
      );
    }

    let requestBody: any;
    if (isJsonBody) {
      requestBody = JSON.stringify(body);
    } else if (body !== null && body !== undefined) {
      requestBody = body;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...requestOptions,
        body: requestBody,
        headers,
        signal,
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        throw error;
      }
      throw normalizeNetworkError(error);
    }

    if (response.status === 204) {
      return undefined;
    }

    const responseBody = await readResponseBody(response);

    if (appConfig.enableDebugLogging) {
      log.debug(`[response] ${method} ${url} status=${response.status}`);
    }

    if (!response.ok) {
      if (
        response.status === 401 &&
        retryOnUnauthorized &&
        !shouldSkipUnauthorizedHandler
      ) {
        log.warn(`[401] Unauthorized on ${method} ${url} — invoking handler`);
        const unauthorizedResult = await unauthorizedHandler?.({
          body: responseBody,
          method,
          status: response.status,
          url,
        });

        if (unauthorizedResult?.retry) {
          log.info(`[401] Retrying ${method} ${url} with refreshed session`);
          return performApiFetch(path, options, false);
        }
      }

      throw normalizeHttpError(response.status, responseBody);
    }

    return responseBody;
  } finally {
    clearTimeout(timeoutId);
    stopTrackingActivity?.();
  }
}

/**
 * Perform a typed API request using the shared HTTP infrastructure.
 */
export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  return performApiFetch(path, options, true) as Promise<TResponse>;
}

/**
 * Backward-compatible apiClient providing method shortcuts.
 */
export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, {
      ...options,
      body: body as Record<string, unknown>,
      method: 'POST',
    }),

  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, {
      ...options,
      body: body as Record<string, unknown>,
      method: 'PUT',
    }),

  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, {
      ...options,
      body: body as Record<string, unknown>,
      method: 'PATCH',
    }),

  delete: <T>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
