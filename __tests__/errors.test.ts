import {
  AppError,
  AuthenticationError,
  NetworkError,
  ValidationError,
  isAppError,
} from '@jujistu/shared/errors/AppError';

describe('AppError', () => {
  it('creates an error with default code and operational flag', () => {
    const error = new AppError('something failed');

    expect(error.message).toBe('something failed');
    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe('AppError');
    expect(error).toBeInstanceOf(Error);
  });

  it('accepts a custom code and non-operational flag', () => {
    const error = new AppError('fatal', 'UNKNOWN_ERROR', {
      isOperational: false,
    });

    expect(error.isOperational).toBe(false);
  });

  it('chains a cause error', () => {
    const cause = new TypeError('null reference');
    const error = new AppError('wrapper', 'UNKNOWN_ERROR', { cause });

    expect(error.cause).toBe(cause);
  });
});

describe('NetworkError', () => {
  it('has the NETWORK_ERROR code', () => {
    const error = new NetworkError('connection timed out');

    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.name).toBe('NetworkError');
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });

  it('chains a cause', () => {
    const cause = new TypeError('fetch failed');
    const error = new NetworkError('offline', { cause });

    expect(error.cause).toBe(cause);
  });
});

describe('AuthenticationError', () => {
  it('has the AUTHENTICATION_ERROR code', () => {
    const error = new AuthenticationError('session expired');

    expect(error.code).toBe('AUTHENTICATION_ERROR');
    expect(error.name).toBe('AuthenticationError');
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(AppError);
  });
});

describe('ValidationError', () => {
  it('has the VALIDATION_ERROR code', () => {
    const error = new ValidationError('invalid email format');

    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.name).toBe('ValidationError');
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(AppError);
  });
});

describe('isAppError', () => {
  it('returns true for AppError instances', () => {
    expect(isAppError(new AppError('test'))).toBe(true);
  });

  it('returns true for AppError subclasses', () => {
    expect(isAppError(new NetworkError('offline'))).toBe(true);
    expect(isAppError(new AuthenticationError('expired'))).toBe(true);
    expect(isAppError(new ValidationError('bad input'))).toBe(true);
  });

  it('returns false for plain Error', () => {
    expect(isAppError(new Error('plain'))).toBe(false);
  });

  it('returns false for non-error values', () => {
    expect(isAppError(null)).toBe(false);
    expect(isAppError(undefined)).toBe(false);
    expect(isAppError('string')).toBe(false);
    expect(isAppError(42)).toBe(false);
  });
});
