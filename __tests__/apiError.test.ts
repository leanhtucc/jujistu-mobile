import {
  normalizeHttpError,
  normalizeNetworkError,
} from '@jujistu/shared/services/api/api-error';
import {
  AuthenticationError,
  NetworkError,
  ValidationError,
} from '@jujistu/shared/errors/AppError';

describe('normalizeHttpError', () => {
  it('returns ValidationError for 400', () => {
    const error = normalizeHttpError(400, { message: 'Bad request' });

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe('Bad request');
  });

  it('returns AuthenticationError for 401', () => {
    const error = normalizeHttpError(401, { message: 'Unauthorized' });

    expect(error).toBeInstanceOf(AuthenticationError);
  });

  it('returns ValidationError for 422', () => {
    const error = normalizeHttpError(422, { message: 'Validation failed' });

    expect(error).toBeInstanceOf(ValidationError);
  });

  it('uses a generic message when body has no message field', () => {
    const error = normalizeHttpError(500, null);

    expect(error.message).toBe('Request failed with status 500');
  });

  it('returns a ServerError with statusCode for 5xx', () => {
    const error = normalizeHttpError(503, { message: 'Service unavailable' });

    expect(error.name).toBe('ServerError');
    expect((error as any).statusCode).toBe(503);
  });
});

describe('normalizeNetworkError', () => {
  it('wraps a TypeError into NetworkError', () => {
    const cause = new TypeError('Failed to fetch');
    const error = normalizeNetworkError(cause);

    expect(error).toBeInstanceOf(NetworkError);
    expect(error.message).toBe('Failed to fetch');
    expect(error.cause).toBe(cause);
  });

  it('handles non-Error values', () => {
    const error = normalizeNetworkError('connection reset');

    expect(error).toBeInstanceOf(NetworkError);
    expect(error.cause).toBeUndefined();
  });
});
