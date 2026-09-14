import { createLogger } from '@jujistu/shared/logger/logger';

import { tokenManager } from './token-manager';

const log = createLogger('RefreshToken');

/**
 * Single-flight refresh lock.
 *
 * When multiple requests receive 401 concurrently, only ONE refresh
 * request is sent. All other callers await the same Promise.
 *
 * If the refresh fails, all waiters receive the failure and the
 * authentication session is cleared exactly once.
 *
 * @param refreshFn - The function that calls the backend refresh endpoint.
 *   It receives the current refresh token and must return new tokens.
 *   This function is provided by the auth feature API module, not by
 *   shared infrastructure, to avoid a circular dependency.
 */

type RefreshFn = (
  refreshToken: string,
) => Promise<{ accessToken: string; refreshToken: string }>;

let inflightRefresh: Promise<string> | null = null;

export async function refreshAccessToken(
  refreshFn: RefreshFn,
): Promise<string> {
  if (inflightRefresh) {
    log.debug('Waiting for in-flight refresh');
    return inflightRefresh;
  }

  inflightRefresh = executeRefresh(refreshFn);

  try {
    return await inflightRefresh;
  } finally {
    inflightRefresh = null;
  }
}

async function executeRefresh(refreshFn: RefreshFn): Promise<string> {
  const currentRefreshToken = await tokenManager.getRefreshToken();

  if (!currentRefreshToken) {
    log.warn('No refresh token available — clearing session');
    await tokenManager.clearTokens();
    throw new Error('No refresh token available');
  }

  try {
    const newTokens = await refreshFn(currentRefreshToken);
    await tokenManager.saveTokens(newTokens);
    log.info('Token refresh succeeded');
    return newTokens.accessToken;
  } catch (error) {
    log.error('Token refresh failed — clearing session');
    await tokenManager.clearTokens();
    throw error;
  }
}

/**
 * Reset the in-flight refresh state.
 * Intended for testing only.
 */
export function resetRefreshState(): void {
  inflightRefresh = null;
}
