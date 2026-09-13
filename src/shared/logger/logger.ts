import { appConfig } from '@jujistu/shared/config/appConfig';

import { redactSensitiveValues } from './redact';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Minimum log level based on the current environment configuration.
 *
 * - Development/staging with debug logging enabled: all levels including debug.
 * - Production or debug logging disabled: warn and above only.
 */
const minLevel: LogLevel = appConfig.enableDebugLogging ? 'debug' : 'warn';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[minLevel];
}

function formatMessage(tag: string, level: LogLevel, message: string): string {
  return `[${tag}] ${level.toUpperCase()}: ${redactSensitiveValues(message)}`;
}

const consoleMethods: Record<LogLevel, (...args: unknown[]) => void> = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

/**
 * Create a tagged logger that respects the application environment.
 *
 * All messages are passed through {@link redactSensitiveValues} before output.
 * Debug and info messages are suppressed when `appConfig.enableDebugLogging`
 * is `false` (production builds).
 *
 * @example
 * ```ts
 * const log = createLogger('AuthService');
 * log.info('User signed in');
 * log.error('Token refresh failed', error);
 * ```
 */
export function createLogger(tag: string): Logger {
  function log(level: LogLevel, message: string, args: unknown[]): void {
    if (!shouldLog(level)) {
      return;
    }

    const formatted = formatMessage(tag, level, message);
    consoleMethods[level](formatted, ...args);
  }

  return {
    debug: (message, ...args) => log('debug', message, args),
    info: (message, ...args) => log('info', message, args),
    warn: (message, ...args) => log('warn', message, args),
    error: (message, ...args) => log('error', message, args),
  };
}
