import { authApi, authKeys } from '@jujistu/features/auth';
import {
  apiRequest,
  AUTH_API_PATHS,
  SKIP_ACCESS_TOKEN_HEADER,
  SKIP_UNAUTHORIZED_HANDLER_HEADER,
} from '@jujistu/shared/services/api';

jest.mock('@jujistu/shared/services/api', () => {
  const actual = jest.requireActual('@jujistu/shared/services/api');
  return {
    ...actual,
    apiRequest: jest.fn(),
  };
});

describe('authKeys', () => {
  it('generates consistent query keys', () => {
    expect(authKeys.all).toEqual(['auth']);
    expect(authKeys.currentUser()).toEqual(['auth', 'currentUser']);
  });
});

describe('authApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('requests an OTP challenge for an email address', async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({
      data: { challenge_id: 'challenge-1', expires_in: 30 },
      message: 'OTP sent',
      status: 200,
      success: true,
    });

    const result = await authApi.requestOtp({ email: 'test@example.com' });

    expect(apiRequest).toHaveBeenCalledWith(
      AUTH_API_PATHS.requestOtp,
      expect.objectContaining({
        method: 'POST',
        body: { email: 'test@example.com' },
        headers: expect.objectContaining({
          [SKIP_ACCESS_TOKEN_HEADER]: 'true',
        }),
      }),
    );
    expect(result).toEqual({
      challengeId: 'challenge-1',
      expiresInSeconds: 30,
    });
  });

  it('verifies an OTP and normalizes the authenticated session', async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({
      data: {
        access_token: 'otp-access',
        refresh_token: 'otp-refresh',
        user: {
          id: 'u-otp',
          email: 'test@example.com',
          displayName: 'OTP User',
        },
      },
      message: 'OTP verified',
      status: 200,
      success: true,
    });

    const result = await authApi.verifyOtp({
      challengeId: 'challenge-1',
      code: '123456',
      email: 'test@example.com',
    });

    expect(apiRequest).toHaveBeenCalledWith(
      AUTH_API_PATHS.verifyOtp,
      expect.objectContaining({
        method: 'POST',
        body: {
          challenge_id: 'challenge-1',
          code: '123456',
          email: 'test@example.com',
        },
        headers: expect.objectContaining({
          [SKIP_ACCESS_TOKEN_HEADER]: 'true',
        }),
      }),
    );
    expect(result.accessToken).toBe('otp-access');
    expect(result.user.email).toBe('test@example.com');
  });

  it('calls login endpoint with skipAuth header and normalizes response', async () => {
    const mockApiResponse = {
      data: {
        access_token: 'acc-1',
        refresh_token: 'ref-1',
        user: {
          id: 'u1',
          email: 'test@example.com',
          displayName: 'Test User',
        },
      },
      message: 'OK',
      status: 200,
      success: true,
    };
    (apiRequest as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    const result = await authApi.login({
      email: 'test@example.com',
      password: 'secretPassword',
    });

    expect(apiRequest).toHaveBeenCalledWith(
      AUTH_API_PATHS.login,
      expect.objectContaining({
        method: 'POST',
        body: { email: 'test@example.com', password: 'secretPassword' },
        headers: expect.objectContaining({
          [SKIP_ACCESS_TOKEN_HEADER]: 'true',
        }),
      }),
    );
    expect(result.accessToken).toBe('acc-1');
    expect(result.refreshToken).toBe('ref-1');
    expect(result.user.email).toBe('test@example.com');
  });

  it('calls register endpoint with skipAuth header and normalizes response', async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({
      data: {
        access_token: 'acc-2',
        refresh_token: 'ref-2',
        user: {
          id: 'u2',
          email: 'new@example.com',
          displayName: 'New User',
        },
      },
      message: 'OK',
      status: 200,
      success: true,
    });

    const result = await authApi.register({
      email: 'new@example.com',
      password: 'secretPassword',
      displayName: 'New User',
    });

    expect(apiRequest).toHaveBeenCalledWith(
      AUTH_API_PATHS.register,
      expect.objectContaining({
        method: 'POST',
        body: {
          email: 'new@example.com',
          password: 'secretPassword',
          displayName: 'New User',
        },
        headers: expect.objectContaining({
          [SKIP_ACCESS_TOKEN_HEADER]: 'true',
        }),
      }),
    );
    expect(result.accessToken).toBe('acc-2');
  });

  it('calls refresh endpoint with skipAuth and skipUnauthorizedHandler headers', async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({
      data: {
        access_token: 'new-acc',
        refresh_token: 'new-ref',
      },
      message: 'OK',
      status: 200,
      success: true,
    });

    const tokens = await authApi.refresh('curr-ref');

    expect(apiRequest).toHaveBeenCalledWith(
      AUTH_API_PATHS.refreshToken,
      expect.objectContaining({
        method: 'POST',
        body: { refresh_token: 'curr-ref' },
        headers: expect.objectContaining({
          [SKIP_ACCESS_TOKEN_HEADER]: 'true',
          [SKIP_UNAUTHORIZED_HANDLER_HEADER]: 'true',
        }),
      }),
    );
    expect(tokens.accessToken).toBe('new-acc');
    expect(tokens.refreshToken).toBe('new-ref');
  });

  it('calls getCurrentUser via GET and normalizes user', async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce({
      data: {
        id: 'u1',
        email: 'user@example.com',
        displayName: 'Current User',
      },
      message: 'OK',
      status: 200,
      success: true,
    });

    const user = await authApi.getCurrentUser();

    expect(apiRequest).toHaveBeenCalledWith(AUTH_API_PATHS.me, {
      method: 'GET',
    });
    expect(user.id).toBe('u1');
    expect(user.email).toBe('user@example.com');
  });

  it('calls logout via POST', async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);

    await authApi.logout();

    expect(apiRequest).toHaveBeenCalledWith(AUTH_API_PATHS.logout, {
      method: 'POST',
    });
  });
});
