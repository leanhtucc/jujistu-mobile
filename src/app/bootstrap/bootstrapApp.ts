import '@jujistu/shared/config/appConfig';
import { createLogger } from '@jujistu/shared/logger/logger';
import { tokenManager } from '@jujistu/shared/services/api';

const log = createLogger('Bootstrap');

let isBootstrapped = false;

export function bootstrapApp() {
  if (isBootstrapped) {
    return;
  }

  // Importing the config module validates the environment before this runs.
  log.info('Application bootstrap initialized');
  isBootstrapped = true;
}

/**
 * Restore authentication session credentials from storage.
 * Returns true if an existing access token is found, false otherwise.
 */
export async function restoreSession(): Promise<boolean> {
  try {
    const token = await tokenManager.getAccessToken();
    log.info(token ? 'Existing session detected' : 'No stored session found');
    return Boolean(token);
  } catch (error) {
    log.error('Failed to restore session from storage', error);
    return false;
  }
}
