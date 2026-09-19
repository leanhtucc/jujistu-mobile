import {
  apiRequest,
  setApiAccessTokenProvider,
  setApiUnauthorizedHandler,
  SKIP_ACCESS_TOKEN_HEADER,
  SKIP_UNAUTHORIZED_HANDLER_HEADER,
  getActiveApiRequestCount,
  AUTH_API_PATHS,
} from '@jujistu/shared/services/api';

jest.mock('@jujistu/shared/config/appConfig', () => ({
  appConfig: {
    apiBaseUrl: 'https://api.jujistu.test',
    enableDebugLogging: false,
    environment: 'development',
  },
}));

describe('http-client (apiRequest)', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    setApiAccessTokenProvider(null);
    setApiUnauthorizedHandler(null);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('injects access token from accessTokenProvider', async () => {
    setApiAccessTokenProvider(async () => 'jwt-test-token');

    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true }),
    });

    await apiRequest('/api/test');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.jujistu.test/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-test-token',
        }),
      }),
    );
  });

  it('skips access token when SKIP_ACCESS_TOKEN_HEADER is true', async () => {
    setApiAccessTokenProvider(async () => 'jwt-test-token');

    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true }),
    });

    await apiRequest('/api/public', {
      headers: { [SKIP_ACCESS_TOKEN_HEADER]: 'true' },
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.jujistu.test/api/public',
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.anything(),
        }),
      }),
    );
  });

  it('invokes unauthorizedHandler on 401 and retries when retry is true', async () => {
    let callCount = 0;
    globalThis.fetch = jest.fn().mockImplementation(async () => {
      callCount += 1;
      if (callCount === 1) {
        return {
          ok: false,
          status: 401,
          headers: { get: () => 'application/json' },
          json: async () => ({ message: 'Token expired' }),
        };
      }
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ retried: true }),
      };
    });

    const mockUnauthorizedHandler = jest
      .fn()
      .mockResolvedValue({ retry: true });
    setApiUnauthorizedHandler(mockUnauthorizedHandler);

    const result = await apiRequest<{ retried: boolean }>('/api/protected');

    expect(mockUnauthorizedHandler).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ retried: true });
  });

  it('does not invoke unauthorizedHandler when SKIP_UNAUTHORIZED_HANDLER_HEADER is true', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Cannot refresh' }),
    });

    const mockUnauthorizedHandler = jest.fn();
    setApiUnauthorizedHandler(mockUnauthorizedHandler);

    await expect(
      apiRequest(AUTH_API_PATHS.refreshToken, {
        headers: { [SKIP_UNAUTHORIZED_HANDLER_HEADER]: 'true' },
      }),
    ).rejects.toThrow('Cannot refresh');

    expect(mockUnauthorizedHandler).not.toHaveBeenCalled();
  });

  it('tracks active request activity during in-flight requests', async () => {
    let resolveResponse: (value: unknown) => void;
    const fetchPromise = new Promise(resolve => {
      resolveResponse = resolve;
    });

    globalThis.fetch = jest.fn().mockReturnValue(fetchPromise);

    expect(getActiveApiRequestCount()).toBe(0);

    const requestPromise = apiRequest('/api/slow');
    expect(getActiveApiRequestCount()).toBe(1);

    resolveResponse!({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ ok: true }),
    });

    await requestPromise;
    expect(getActiveApiRequestCount()).toBe(0);
  });

  it('returns undefined on 204 No Content', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 204,
      headers: { get: () => null },
    });

    const result = await apiRequest<void>('/api/no-content');
    expect(result).toBeUndefined();
  });

  it('aborts and throws network error when request times out', async () => {
    globalThis.fetch = jest.fn().mockImplementation(
      (_url, options) =>
        new Promise((_, reject) => {
          const signal = options?.signal as AbortSignal;
          if (signal) {
            signal.addEventListener('abort', () => {
              reject(new Error('AbortError: The user aborted a request.'));
            });
          }
        }),
    );

    await expect(
      apiRequest('/api/timeout', { timeoutMs: 50 }),
    ).rejects.toThrow();
  });

  it('respects caller abort signal', async () => {
    const callerController = new AbortController();

    globalThis.fetch = jest.fn().mockImplementation((_url, options) => {
      const signal = options?.signal as AbortSignal;
      if (signal?.aborted) {
        return Promise.reject(
          new Error('AbortError: The user aborted a request.'),
        );
      }
      return new Promise((_, reject) => {
        signal?.addEventListener('abort', () => {
          reject(new Error('AbortError: The user aborted a request.'));
        });
      });
    });

    const promise = apiRequest('/api/cancel', {
      signal: callerController.signal,
    });
    callerController.abort();

    await expect(promise).rejects.toThrow();
  });

  it('does not set Content-Type: application/json for FormData body', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ uploaded: true }),
    });

    // Mock FormData in Node test environment
    class FormData {
      _parts: any[] = [];
    }
    const formData = new FormData();

    await apiRequest('/api/upload', {
      method: 'POST',
      body: formData,
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.jujistu.test/api/upload',
      expect.objectContaining({
        headers: expect.not.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });
});
