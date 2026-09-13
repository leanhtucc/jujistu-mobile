/**
 * Structured error types for the JUJISTU application.
 *
 * Every error thrown intentionally by application code should extend
 * {@link AppError} so that error boundaries, loggers, and HTTP interceptors
 * can distinguish operational errors from unexpected crashes.
 */

export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Base error for all operational errors raised by JUJISTU code.
 *
 * Operational errors represent expected failure modes (network timeout, invalid
 * input, expired token) as opposed to programmer mistakes. The `isOperational`
 * flag lets global handlers decide between graceful recovery and crash
 * reporting.
 */
export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly isOperational: boolean;
  override readonly cause?: Error;

  constructor(
    message: string,
    code: AppErrorCode = 'UNKNOWN_ERROR',
    options?: { isOperational?: boolean; cause?: Error },
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.isOperational = options?.isOperational ?? true;
    this.cause = options?.cause;
  }
}

/**
 * A recoverable network failure (timeout, DNS, connection refused, etc.).
 */
export class NetworkError extends AppError {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, 'NETWORK_ERROR', {
      isOperational: true,
      cause: options?.cause,
    });
    this.name = 'NetworkError';
  }
}

/**
 * The user's session is invalid or expired and requires re-authentication.
 */
export class AuthenticationError extends AppError {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, 'AUTHENTICATION_ERROR', {
      isOperational: true,
      cause: options?.cause,
    });
    this.name = 'AuthenticationError';
  }
}

/**
 * Input or response data failed schema validation.
 */
export class ValidationError extends AppError {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, 'VALIDATION_ERROR', {
      isOperational: true,
      cause: options?.cause,
    });
    this.name = 'ValidationError';
  }
}

/**
 * Type guard that narrows `unknown` to {@link AppError}.
 */
export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}
