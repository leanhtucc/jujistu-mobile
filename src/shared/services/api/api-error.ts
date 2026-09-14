import {
  AppError,
  AuthenticationError,
  NetworkError,
  ValidationError,
} from '@jujistu/shared/errors/AppError';

/**
 * Extended error codes for HTTP-layer failures.
 *
 * These augment the base {@link AppError} codes with status-specific
 * categories so that features can handle errors at the appropriate
 * granularity.
 */

export class ForbiddenError extends AppError {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, 'AUTHENTICATION_ERROR', {
      isOperational: true,
      cause: options?.cause,
    });
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, 'VALIDATION_ERROR', {
      isOperational: true,
      cause: options?.cause,
    });
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, 'NETWORK_ERROR', {
      isOperational: true,
      cause: options?.cause,
    });
    this.name = 'RateLimitError';
  }
}

export class ServerError extends AppError {
  readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    options?: { cause?: Error },
  ) {
    super(message, 'UNKNOWN_ERROR', {
      isOperational: true,
      cause: options?.cause,
    });
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

/**
 * Normalize an HTTP response into the appropriate {@link AppError} subclass.
 *
 * This function does NOT throw — it returns the error so callers can decide
 * whether to throw, return, or enqueue it.
 */
export function normalizeHttpError(status: number, body: unknown): AppError {
  const message =
    typeof body === 'object' &&
    body !== null &&
    'message' in body &&
    typeof (body as Record<string, unknown>).message === 'string'
      ? ((body as Record<string, unknown>).message as string)
      : `Request failed with status ${status}`;

  switch (true) {
    case status === 400:
      return new ValidationError(message);
    case status === 401:
      return new AuthenticationError(message);
    case status === 403:
      return new ForbiddenError(message);
    case status === 404:
      return new NotFoundError(message);
    case status === 409:
      return new ValidationError(message);
    case status === 422:
      return new ValidationError(message);
    case status === 429:
      return new RateLimitError(message);
    case status >= 500:
      return new ServerError(message, status);
    default:
      return new AppError(message, 'UNKNOWN_ERROR');
  }
}

/**
 * Normalize a fetch/network error into a {@link NetworkError}.
 */
export function normalizeNetworkError(error: unknown): NetworkError {
  const cause = error instanceof Error ? error : undefined;
  const message =
    cause?.message ?? 'A network error occurred. Please check your connection.';
  return new NetworkError(message, { cause });
}
