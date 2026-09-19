import {
  notifyManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

import { authQueryKeys } from '../src/features/auth/hooks/auth-query-keys';
import { useAuthSession } from '../src/features/auth/hooks/use-auth-session';
import { useCurrentUser } from '../src/features/auth/hooks/use-current-user';
import { useLogout } from '../src/features/auth/hooks/use-logout';
import { useRequestOtp } from '../src/features/auth/hooks/use-request-otp';
import { useVerifyOtp } from '../src/features/auth/hooks/use-verify-otp';
import * as authService from '../src/features/auth/services/auth-service';
import { tokenManager } from '@jujistu/shared/services/api';

beforeAll(() => {
  notifyManager.setScheduler(fn => fn());
});

jest.mock('../src/features/auth/services/auth-service', () => ({
  requestOtp: jest.fn(),
  verifyOtp: jest.fn(),
  getCurrentUser: jest.fn(),
  logout: jest.fn(),
}));

jest.mock('@jujistu/shared/services/api', () => {
  const actual = jest.requireActual('@jujistu/shared/services/api');
  return {
    ...actual,
    tokenManager: {
      getAccessToken: jest.fn().mockResolvedValue(null),
      saveTokens: jest.fn().mockResolvedValue(undefined),
      clearTokens: jest.fn().mockResolvedValue(undefined),
    },
  };
});

function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, Wrapper };
}

describe('Auth Feature Hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useRequestOtp', () => {
    it('executes requestOtp action and tracks submitting state', async () => {
      (authService.requestOtp as jest.Mock).mockResolvedValueOnce({
        challengeId: 'c-1',
        expiresInSeconds: 60,
      });

      const { Wrapper } = createTestWrapper();
      let hookResult!: ReturnType<typeof useRequestOtp>;

      function TestComponent() {
        hookResult = useRequestOtp();
        return null;
      }

      await act(async () => {
        ReactTestRenderer.create(
          <Wrapper>
            <TestComponent />
          </Wrapper>,
        );
      });

      expect(hookResult.isSubmitting).toBe(false);
      expect(hookResult.error).toBeNull();

      let challengeResult: any;
      await act(async () => {
        challengeResult = await hookResult.requestOtp({
          email: 'user@test.com',
        });
      });

      expect(challengeResult).toEqual({
        challengeId: 'c-1',
        expiresInSeconds: 60,
      });
      expect(authService.requestOtp).toHaveBeenCalledWith({
        email: 'user@test.com',
      });
    });

    it('sets error on failure and resets on clearError', async () => {
      (authService.requestOtp as jest.Mock).mockRejectedValueOnce(
        new Error('Network failure'),
      );

      const { Wrapper } = createTestWrapper();
      let hookResult!: ReturnType<typeof useRequestOtp>;

      function TestComponent() {
        hookResult = useRequestOtp();
        return null;
      }

      await act(async () => {
        ReactTestRenderer.create(
          <Wrapper>
            <TestComponent />
          </Wrapper>,
        );
      });

      await act(async () => {
        try {
          await hookResult.requestOtp({ email: 'user@test.com' });
        } catch {
          // Expected
        }
      });

      expect(hookResult.error?.message).toBe('Network failure');

      act(() => {
        hookResult.clearError();
      });

      expect(hookResult.error).toBeNull();
    });
  });

  describe('useVerifyOtp', () => {
    it('saves tokens and seeds currentUser query on success', async () => {
      const mockSession = {
        accessToken: 'access-123',
        refreshToken: 'refresh-456',
        user: {
          id: 'u-1',
          email: 'athlete@jujistu.app',
          displayName: 'Athlete',
        },
      };
      (authService.verifyOtp as jest.Mock).mockResolvedValueOnce(mockSession);

      const { queryClient, Wrapper } = createTestWrapper();
      let hookResult!: ReturnType<typeof useVerifyOtp>;

      function TestComponent() {
        hookResult = useVerifyOtp();
        return null;
      }

      await act(async () => {
        ReactTestRenderer.create(
          <Wrapper>
            <TestComponent />
          </Wrapper>,
        );
      });

      await act(async () => {
        await hookResult.verifyOtp({
          challengeId: 'c-1',
          code: '123456',
          email: 'athlete@jujistu.app',
        });
      });

      expect(tokenManager.saveTokens).toHaveBeenCalledWith({
        accessToken: 'access-123',
        refreshToken: 'refresh-456',
      });

      const cachedUser = queryClient.getQueryData(authQueryKeys.currentUser());
      expect(cachedUser).toEqual(mockSession.user);
    });
  });

  describe('useLogout', () => {
    it('clears credentials and removes auth cache even if server fails', async () => {
      (authService.logout as jest.Mock).mockRejectedValueOnce(
        new Error('Server error revoking token'),
      );

      const { queryClient, Wrapper } = createTestWrapper();
      queryClient.setQueryData(authQueryKeys.currentUser(), { id: 'u-1' });

      let hookResult!: ReturnType<typeof useLogout>;

      function TestComponent() {
        hookResult = useLogout();
        return null;
      }

      await act(async () => {
        ReactTestRenderer.create(
          <Wrapper>
            <TestComponent />
          </Wrapper>,
        );
      });

      await act(async () => {
        await hookResult.logout();
      });

      expect(tokenManager.clearTokens).toHaveBeenCalled();
      expect(
        queryClient.getQueryData(authQueryKeys.currentUser()),
      ).toBeUndefined();
    });
  });

  describe('useCurrentUser', () => {
    it('fetches current user and returns auth state', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValueOnce({
        id: 'u-current',
        email: 'current@jujistu.app',
      });

      const { Wrapper } = createTestWrapper();
      let hookResult!: ReturnType<typeof useCurrentUser>;

      function TestComponent() {
        hookResult = useCurrentUser();
        return null;
      }

      await act(async () => {
        ReactTestRenderer.create(
          <Wrapper>
            <TestComponent />
          </Wrapper>,
        );
      });

      await act(async () => {
        await Promise.resolve();
      });

      expect(hookResult.user?.id).toBe('u-current');
      expect(hookResult.isAuthenticated).toBe(true);
    });
  });

  describe('useAuthSession', () => {
    it('initializes to unauthenticated state when no token is found', async () => {
      (tokenManager.getAccessToken as jest.Mock).mockResolvedValueOnce(null);

      const { Wrapper } = createTestWrapper();
      let hookResult!: ReturnType<typeof useAuthSession>;

      function TestComponent() {
        hookResult = useAuthSession();
        return null;
      }

      await act(async () => {
        ReactTestRenderer.create(
          <Wrapper>
            <TestComponent />
          </Wrapper>,
        );
      });

      await act(async () => {
        await Promise.resolve();
      });

      expect(hookResult.isInitializing).toBe(false);
      expect(hookResult.isAuthenticated).toBe(false);
      expect(hookResult.user).toBeNull();
    });

    it('loads current user when token exists', async () => {
      (tokenManager.getAccessToken as jest.Mock).mockResolvedValueOnce(
        'valid-token',
      );
      (authService.getCurrentUser as jest.Mock).mockResolvedValueOnce({
        id: 'u-persisted',
        email: 'persisted@jujistu.app',
        displayName: 'Persisted User',
      });

      const { Wrapper } = createTestWrapper();
      let hookResult!: ReturnType<typeof useAuthSession>;

      function TestComponent() {
        hookResult = useAuthSession();
        return null;
      }

      await act(async () => {
        ReactTestRenderer.create(
          <Wrapper>
            <TestComponent />
          </Wrapper>,
        );
      });

      // Flush token check
      await act(async () => {
        await Promise.resolve();
      });

      // Flush current user query
      await act(async () => {
        await Promise.resolve();
      });

      expect(hookResult.isInitializing).toBe(false);
      expect(hookResult.isAuthenticated).toBe(true);
      expect(hookResult.user?.email).toBe('persisted@jujistu.app');
    });
  });
});
