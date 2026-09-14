import {
  tokenManager,
  setTokenStorage,
  KeychainTokenStorage,
  type TokenPair,
  type TokenStorage,
} from '@jujistu/shared/services/api/token-manager';

class TestTokenStorage implements TokenStorage {
  private tokens: TokenPair | null = null;

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

describe('tokenManager', () => {
  beforeEach(() => {
    setTokenStorage(new TestTokenStorage());
  });

  it('returns null when no tokens are stored', async () => {
    expect(await tokenManager.getTokens()).toBeNull();
    expect(await tokenManager.getAccessToken()).toBeNull();
    expect(await tokenManager.getRefreshToken()).toBeNull();
  });

  it('saves and retrieves tokens', async () => {
    const tokens: TokenPair = {
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
    };

    await tokenManager.saveTokens(tokens);

    expect(await tokenManager.getTokens()).toEqual(tokens);
    expect(await tokenManager.getAccessToken()).toBe('access-123');
    expect(await tokenManager.getRefreshToken()).toBe('refresh-456');
  });

  it('clears tokens', async () => {
    await tokenManager.saveTokens({
      accessToken: 'a',
      refreshToken: 'r',
    });

    await tokenManager.clearTokens();

    expect(await tokenManager.getTokens()).toBeNull();
  });

  it('allows swapping the storage implementation', async () => {
    const storageA = new TestTokenStorage();
    const storageB = new TestTokenStorage();

    setTokenStorage(storageA);
    await tokenManager.saveTokens({
      accessToken: 'a-token',
      refreshToken: 'a-refresh',
    });

    setTokenStorage(storageB);
    expect(await tokenManager.getTokens()).toBeNull();
  });
});

describe('KeychainTokenStorage', () => {
  it('saves and retrieves tokens using Keychain mock', async () => {
    const keychainStorage = new KeychainTokenStorage();
    const tokens: TokenPair = {
      accessToken: 'kc-access-test',
      refreshToken: 'kc-refresh-test',
    };

    await keychainStorage.saveTokens(tokens);
    const retrieved = await keychainStorage.getTokens();

    expect(retrieved).toEqual(tokens);

    await keychainStorage.clearTokens();
    const afterClear = await keychainStorage.getTokens();
    expect(afterClear).toBeNull();
  });
});
