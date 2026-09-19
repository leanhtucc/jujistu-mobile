import {
  getCurrentUser,
  login,
  logout,
  refreshSession,
  register,
  requestOtp,
  verifyOtp,
} from '../src/features/auth/services/auth-service';
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

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requestOtp', () => {
    it('sends request and parses response successfully', async () => {
      (apiRequest as jest.Mock).mockResolvedValueOnce({
        data: { challenge_id: 'challenge-xyz', expires_in: 60 },
        message: 'OTP Sent',
        status: 200,
        success: true,
      });

      const result = await requestOtp({ email: 'athlete@jujistu.app' });

      expect(apiRequest).toHaveBeenCalledWith(
        AUTH_API_PATHS.requestOtp,
        expect.objectContaining({
          method: 'POST',
          body: { email: 'athlete@jujistu.app' },
          headers: expect.objectContaining({
            [SKIP_ACCESS_TOKEN_HEADER]: 'true',
          }),
        }),
      );

      expect(result).toEqual({
        challengeId: 'challenge-xyz',
        expiresInSeconds: 60,
      });
    });

    it('throws when challenge_id is missing in response', async () => {
      (apiRequest as jest.Mock).mockResolvedValueOnce({
        data: { expires_in: 60 },
      });

      await expect(
        requestOtp({ email: 'athlete@jujistu.app' }),
      ).rejects.toThrow(
        'Malformed OTP challenge response: challenge_id is missing.',
      );
    });
  });

  describe('verifyOtp', () => {
    it('verifies OTP and parses complete session with user profile', async () => {
      (apiRequest as jest.Mock).mockResolvedValueOnce({
        data: {
          access_token: 'valid-access',
          refresh_token: 'valid-refresh',
          user: {
            id: 'usr-123',
            email: 'athlete@jujistu.app',
            displayName: 'Athlete Name',
            avatarUrl: 'https://jujistu.app/avatar.png',
          },
        },
      });

      const session = await verifyOtp({
        challengeId: 'challenge-xyz',
        code: '123456',
        email: 'athlete@jujistu.app',
      });

      expect(session).toEqual({
        accessToken: 'valid-access',
        refreshToken: 'valid-refresh',
        user: {
          id: 'usr-123',
          email: 'athlete@jujistu.app',
          displayName: 'Athlete Name',
          avatarUrl: 'https://jujistu.app/avatar.png',
        },
      });
    });

    it('rejects fake user fallback when user object is missing', async () => {
      (apiRequest as jest.Mock).mockResolvedValueOnce({
        data: {
          access_token: 'valid-access',
          refresh_token: 'valid-refresh',
        },
      });

      await expect(
        verifyOtp({
          challengeId: 'challenge-xyz',
          code: '123456',
          email: 'athlete@jujistu.app',
        }),
      ).rejects.toThrow(/Fake user fallback is rejected/);
    });
  });

  describe('refreshSession', () => {
    it('sends refresh token with skip headers and normalizes token pair', async () => {
      (apiRequest as jest.Mock).mockResolvedValueOnce({
        data: {
          access_token: 'new-access',
          refresh_token: 'new-refresh',
        },
      });

      const tokens = await refreshSession('old-refresh');

      expect(apiRequest).toHaveBeenCalledWith(
        AUTH_API_PATHS.refreshToken,
        expect.objectContaining({
          method: 'POST',
          body: { refresh_token: 'old-refresh' },
          headers: expect.objectContaining({
            [SKIP_ACCESS_TOKEN_HEADER]: 'true',
            [SKIP_UNAUTHORIZED_HANDLER_HEADER]: 'true',
          }),
        }),
      );

      expect(tokens).toEqual({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      });
    });
  });

  describe('getCurrentUser', () => {
    it('fetches and normalizes current user profile', async () => {
      (apiRequest as jest.Mock).mockResolvedValueOnce({
        data: {
          id: 'usr-me',
          email: 'me@jujistu.app',
          displayName: 'Current Athlete',
          avatarUrl: null,
        },
      });

      const user = await getCurrentUser();

      expect(apiRequest).toHaveBeenCalledWith(
        AUTH_API_PATHS.me,
        expect.objectContaining({
          method: 'GET',
        }),
      );

      expect(user).toEqual({
        id: 'usr-me',
        email: 'me@jujistu.app',
        displayName: 'Current Athlete',
        avatarUrl: null,
      });
    });
  });

  describe('logout', () => {
    it('calls logout endpoint with POST', async () => {
      (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);

      await logout();

      expect(apiRequest).toHaveBeenCalledWith(
        AUTH_API_PATHS.logout,
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });
  });

  describe('login and register', () => {
    it('normalizes login credentials response', async () => {
      (apiRequest as jest.Mock).mockResolvedValueOnce({
        data: {
          access_token: 'login-acc',
          refresh_token: 'login-ref',
          user: {
            id: 'u-1',
            email: 'user@test.com',
            displayName: 'Test',
          },
        },
      });

      const session = await login({
        email: 'user@test.com',
        password: 'secret',
      });
      expect(session.accessToken).toBe('login-acc');
      expect(session.user.id).toBe('u-1');
    });

    it('normalizes register response', async () => {
      (apiRequest as jest.Mock).mockResolvedValueOnce({
        data: {
          access_token: 'reg-acc',
          refresh_token: 'reg-ref',
          user: {
            id: 'u-2',
            email: 'new@test.com',
            displayName: 'New User',
          },
        },
      });

      const session = await register({
        displayName: 'New User',
        email: 'new@test.com',
        password: 'secret',
      });
      expect(session.accessToken).toBe('reg-acc');
      expect(session.user.displayName).toBe('New User');
    });
  });
});
