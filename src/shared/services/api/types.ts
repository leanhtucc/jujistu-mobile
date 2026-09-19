import { AppError } from '@jujistu/shared/errors/AppError';

export type ApiErrorBody = {
  code?: string;
  details?: unknown;
  message?: string;
};

export class ApiError extends AppError {
  readonly status: number;
  readonly body?: ApiErrorBody | unknown;

  constructor(message: string, status: number, body?: ApiErrorBody | unknown) {
    super(message, status === 0 ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR');
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export type ApiRequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  timeoutMs?: number;
  trackActivity?: boolean;
};
