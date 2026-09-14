import {
  refreshAccessToken,
  resetRefreshState,
} from '@jujistu/shared/services/api/refresh-token';
import {
  setTokenStorage,
  type TokenPair,
  type TokenStorage,
} from '@jujistu/shared/services/api/token-manager';

class TestTokenStorage implements TokenStorage {
  tokens: TokenPair | null = null;

  async getTokens() {
    return this.tokens;
  }
  async saveTokens(tokens: TokenPair) {
    this.tokens = tokens;
  }
  async clearTokens() {
    this.tokens = null;
  }
}

describe('refreshAccessToken', () => {
  let storage: TestTokenStorage;

  beforeEach(() => {
    resetRefreshState();
    storage = new TestTokenStorage();
    setTokenStorage(storage);
  });

  it('refreshes and saves new tokens', async () => {
    storage.tokens = {
      accessToken: 'old-access',
      refreshToken: 'old-refresh',
    };

    const refreshFn = jest.fn().mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });

    const result = await refreshAccessToken(refreshFn);

    expect(result).toBe('new-access');
    expect(refreshFn).toHaveBeenCalledWith('old-refresh');
    expect(storage.tokens?.accessToken).toBe('new-access');
  });

  it('clears tokens when no refresh token is available', async () => {
    storage.tokens = null;

    const refreshFn = jest.fn();

    await expect(refreshAccessToken(refreshFn)).rejects.toThrow(
      'No refresh token available',
    );
    expect(refreshFn).not.toHaveBeenCalled();
  });

  it('clears tokens when refresh fails', async () => {
    storage.tokens = {
      accessToken: 'old-access',
      refreshToken: 'old-refresh',
    };

    const refreshFn = jest
      .fn()
      .mockRejectedValue(new Error('Refresh rejected'));

    await expect(refreshAccessToken(refreshFn)).rejects.toThrow(
      'Refresh rejected',
    );
    expect(storage.tokens).toBeNull();
  });

  it('deduplicates concurrent refresh requests (single-flight)', async () => {
    storage.tokens = {
      accessToken: 'old',
      refreshToken: 'refresh',
    };

    let resolveRefresh: (value: TokenPair) => void;
    const refreshPromise = new Promise<TokenPair>(resolve => {
      resolveRefresh = resolve;
    });
    const refreshFn = jest.fn().mockReturnValue(refreshPromise);

    // Launch 3 concurrent refreshes
    const promise1 = refreshAccessToken(refreshFn);
    const promise2 = refreshAccessToken(refreshFn);
    const promise3 = refreshAccessToken(refreshFn);

    // Allow the async getRefreshToken() call to resolve before asserting
    await new Promise<void>(resolve => setTimeout(() => resolve(), 0));

    // Only ONE refresh call should have been made
    expect(refreshFn).toHaveBeenCalledTimes(1);

    resolveRefresh!({
      accessToken: 'shared-new',
      refreshToken: 'shared-refresh',
    });

    const [result1, result2, result3] = await Promise.all([
      promise1,
      promise2,
      promise3,
    ]);

    // All three should receive the same new access token
    expect(result1).toBe('shared-new');
    expect(result2).toBe('shared-new');
    expect(result3).toBe('shared-new');
  });

  it('clears inflight state after failure so next attempt works', async () => {
    storage.tokens = {
      accessToken: 'old',
      refreshToken: 'refresh',
    };

    const refreshFn = jest
      .fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValueOnce({
        accessToken: 'recovered',
        refreshToken: 'new-refresh',
      });

    await expect(refreshAccessToken(refreshFn)).rejects.toThrow(
      'First failure',
    );

    // Restore tokens for second attempt
    storage.tokens = {
      accessToken: 'old',
      refreshToken: 'refresh-2',
    };

    const result = await refreshAccessToken(refreshFn);
    expect(result).toBe('recovered');
    expect(refreshFn).toHaveBeenCalledTimes(2);
  });
});
