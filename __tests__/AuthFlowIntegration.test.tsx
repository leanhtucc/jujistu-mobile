import { authApi, authKeys, useAuthState } from '@jujistu/features/auth';
import { tokenManager } from '@jujistu/shared/services/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

jest.mock('@jujistu/shared/services/api', () => {
  const actual = jest.requireActual('@jujistu/shared/services/api');
  return {
    ...actual,
    tokenManager: {
      getAccessToken: jest.fn(),
      saveTokens: jest.fn().mockResolvedValue(undefined),
      clearTokens: jest.fn().mockResolvedValue(undefined),
    },
  };
});

jest.mock('@jujistu/features/auth/api/auth.api', () => ({
  authApi: {
    getCurrentUser: jest.fn(),
  },
}));

function TestConsumer({
  onStateChange,
}: {
  onStateChange: (state: ReturnType<typeof useAuthState>) => void;
}) {
  const state = useAuthState();
  React.useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);
  return null;
}

describe('AuthFlowIntegration & useAuthState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts initializing and resolves to unauthenticated state when no token exists', async () => {
    (tokenManager.getAccessToken as jest.Mock).mockResolvedValueOnce(null);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    let latestState: ReturnType<typeof useAuthState> | undefined;
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <QueryClientProvider client={queryClient}>
          <TestConsumer onStateChange={s => (latestState = s)} />
        </QueryClientProvider>,
      );
    });

    // Initially initializing
    expect(latestState?.isInitializing).toBe(true);
    expect(latestState?.isAuthenticated).toBe(false);

    // Advance past minimum initialize duration (600ms)
    await act(async () => {
      jest.advanceTimersByTime(650);
      await Promise.resolve();
    });

    // Resolves to unauthenticated state (AuthNavigator)
    expect(latestState?.isInitializing).toBe(false);
    expect(latestState?.isAuthenticated).toBe(false);
    expect(latestState?.user).toBeNull();

    act(() => {
      tree.unmount();
    });
  });

  it('resolves to authenticated state when a valid token and user session exist', async () => {
    (tokenManager.getAccessToken as jest.Mock).mockResolvedValueOnce(
      'stored-valid-token',
    );

    const mockUser = {
      id: 'usr-champion-1',
      email: 'champion@jujistu.vn',
      displayName: 'Champion',
    };

    (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    // Pre-seed query cache with user data (as saved during login/verify)
    queryClient.setQueryData(authKeys.currentUser(), mockUser);

    let latestState: ReturnType<typeof useAuthState> | undefined;
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <QueryClientProvider client={queryClient}>
          <TestConsumer onStateChange={s => (latestState = s)} />
        </QueryClientProvider>,
      );
    });

    // Advance past minimum initialize duration
    await act(async () => {
      jest.advanceTimersByTime(650);
      await Promise.resolve();
    });

    // Resolves to authenticated state (MainNavigator)
    expect(latestState?.isInitializing).toBe(false);
    expect(latestState?.isAuthenticated).toBe(true);
    expect(latestState?.user?.id).toBe('usr-champion-1');
    expect(latestState?.user?.displayName).toBe('Champion');

    act(() => {
      tree.unmount();
    });
  });
});
