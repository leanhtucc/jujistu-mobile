import { createLogger } from '@jujistu/shared/logger/logger';
import * as Keychain from 'react-native-keychain';

const log = createLogger('KeychainStorage');
const KEYCHAIN_SERVICE = 'com.jujistu.auth';

/**
 * Token storage abstraction.
 *
 * Business code and feature modules interact with this interface only.
 * Tokens are securely stored using react-native-keychain (Keychain on iOS,
 * Keystore on Android).
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

export class KeychainTokenStorage implements TokenStorage {
  async getTokens(): Promise<TokenPair | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });

      if (!credentials || typeof credentials === 'boolean') {
        return null;
      }

      const parsed = JSON.parse(credentials.password) as TokenPair;
      if (parsed.accessToken && parsed.refreshToken) {
        return parsed;
      }
      return null;
    } catch (error) {
      log.error('Failed to retrieve tokens from Keychain', error);
      return null;
    }
  }

  async saveTokens(tokens: TokenPair): Promise<void> {
    try {
      await Keychain.setGenericPassword('auth_tokens', JSON.stringify(tokens), {
        service: KEYCHAIN_SERVICE,
      });
    } catch (error) {
      log.error('Failed to save tokens to Keychain', error);
      throw error;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
    } catch (error) {
      log.error('Failed to clear tokens from Keychain', error);
    }
  }
}

export class InMemoryTokenStorage implements TokenStorage {
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

let storage: TokenStorage = new KeychainTokenStorage();

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
