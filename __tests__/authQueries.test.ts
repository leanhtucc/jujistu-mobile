import { authKeys } from '@jujistu/features/auth';
import { authApi } from '@jujistu/features/auth';
import { apiClient } from '@jujistu/shared/services/api';

jest.mock('@jujistu/shared/services/api', () => {
  const actual = jest.requireActual('@jujistu/shared/services/api');
  return {
    ...actual,
    apiClient: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    },
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

  it('calls login endpoint with skipAuth', async () => {
    const mockSession = {
      user: { id: 'u1', email: 'test@example.com', displayName: 'Test User' },
      accessToken: 'acc-1',
      refreshToken: 'ref-1',
    };
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockSession);

    const result = await authApi.login({
      email: 'test@example.com',
      password: 'secretPassword',
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/auth/login',
      { email: 'test@example.com', password: 'secretPassword' },
      { skipAuth: true },
    );
    expect(result).toEqual(mockSession);
  });

  it('calls register endpoint with skipAuth', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      user: { id: 'u2', email: 'new@example.com', displayName: 'New User' },
      accessToken: 'acc-2',
      refreshToken: 'ref-2',
    });

    await authApi.register({
      email: 'new@example.com',
      password: 'secretPassword',
      displayName: 'New User',
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/auth/register',
      {
        email: 'new@example.com',
        password: 'secretPassword',
        displayName: 'New User',
      },
      { skipAuth: true },
    );
  });

  it('calls refresh endpoint with skipAuth and payload', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      accessToken: 'new-acc',
      refreshToken: 'new-ref',
    });

    await authApi.refresh('curr-ref');

    expect(apiClient.post).toHaveBeenCalledWith(
      '/auth/refresh',
      { refreshToken: 'curr-ref' },
      { skipAuth: true },
    );
  });

  it('calls getCurrentUser via GET', async () => {
    const mockUser = {
      id: 'u1',
      email: 'user@example.com',
      displayName: 'Current User',
    };
    (apiClient.get as jest.Mock).mockResolvedValueOnce(mockUser);

    const user = await authApi.getCurrentUser();

    expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
    expect(user).toEqual(mockUser);
  });

  it('calls logout via POST', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce(undefined);

    await authApi.logout();

    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
  });
});
