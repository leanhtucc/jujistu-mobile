import {
  apiClient,
  setTokenStorage,
  type TokenStorage,
} from '@jujistu/shared/services/api';

jest.mock('@jujistu/shared/config/appConfig', () => ({
  appConfig: {
    apiBaseUrl: 'https://api.example.com',
    enableDebugLogging: true,
    environment: 'development',
  },
}));

describe('apiClient', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    const memoryStorage: TokenStorage = {
      getTokens: async () => ({
        accessToken: 'valid-test-token',
        refreshToken: 'valid-refresh-token',
      }),
      saveTokens: async () => {},
      clearTokens: async () => {},
    };
    setTokenStorage(memoryStorage);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('performs GET request with Authorization header', async () => {
    const mockResponseData = { id: 1, name: 'Test' };
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponseData,
    });

    const result = await apiClient.get('/test');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer valid-test-token',
          Accept: 'application/json',
        }),
      }),
    );
    expect(result).toEqual(mockResponseData);
  });

  it('omits Authorization header when skipAuth is true', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'public' }),
    });

    await apiClient.post(
      '/public-endpoint',
      { key: 'val' },
      { skipAuth: true },
    );

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.example.com/public-endpoint',
      expect.objectContaining({
        method: 'POST',
        headers: expect.not.objectContaining({
          Authorization: expect.anything(),
        }),
      }),
    );
  });

  it('normalizes HTTP 401 error into AuthenticationError', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized access' }),
    });

    await expect(apiClient.get('/protected')).rejects.toMatchObject({
      code: 'AUTHENTICATION_ERROR',
      name: 'AuthenticationError',
    });
  });

  it('normalizes HTTP 500 into ServerError', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Internal Server Error' }),
    });

    await expect(apiClient.get('/error')).rejects.toMatchObject({
      name: 'ServerError',
      statusCode: 500,
    });
  });

  it('normalizes fetch network failure into NetworkError', async () => {
    globalThis.fetch = jest
      .fn()
      .mockRejectedValueOnce(new TypeError('Network request failed'));

    await expect(apiClient.get('/offline')).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      name: 'NetworkError',
    });
  });

  it('handles 204 No Content returning undefined', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await apiClient.delete('/item/1');
    expect(result).toBeUndefined();
  });
});
