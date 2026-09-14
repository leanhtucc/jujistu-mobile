/**
 * Token storage abstraction.
 *
 * Business code and feature modules interact with this interface only.
 * The concrete implementation (react-native-keychain) is wired in Phase 7.
 * Until then, tokens are held in memory for development/testing purposes.
 *
 * IMPORTANT: Feature code must never import react-native-keychain directly.
 */

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenStorage {
  getTokens(): Promise<TokenPair | null>;
  saveTokens(tokens: TokenPair): Promise<void>;
  clearTokens(): Promise<void>;
}

/**
 * In-memory token storage for development and testing.
 *
 * This will be replaced by a Keychain/Keystore-backed implementation
 * when react-native-keychain is installed in Phase 7.
 *
 * TODO: Replace with secure storage (react-native-keychain) — Phase 7
 */
class InMemoryTokenStorage implements TokenStorage {
  private tokens: TokenPair | null = null;

  async getTokens(): Promise<TokenPair | null> {
    return this.tokens;
  }

  async saveTokens(tokens: TokenPair): Promise<void> {
    this.tokens = tokens;
  }

  async clearTokens(): Promise<void> {
    this.tokens = null;
  }
}

/**
 * Singleton token manager instance.
 *
 * Call `setTokenStorage()` during app bootstrap to replace the default
 * in-memory storage with a secure implementation.
 */
let storage: TokenStorage = new InMemoryTokenStorage();

export function setTokenStorage(impl: TokenStorage): void {
  storage = impl;
}

export const tokenManager = {
  getTokens: (): Promise<TokenPair | null> => storage.getTokens(),
  saveTokens: (tokens: TokenPair): Promise<void> => storage.saveTokens(tokens),
  clearTokens: (): Promise<void> => storage.clearTokens(),

  async getAccessToken(): Promise<string | null> {
    const tokens = await storage.getTokens();
    return tokens?.accessToken ?? null;
  },

  async getRefreshToken(): Promise<string | null> {
    const tokens = await storage.getTokens();
    return tokens?.refreshToken ?? null;
  },
};
