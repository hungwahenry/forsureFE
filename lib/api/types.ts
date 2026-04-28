/**
 * Mirrors the backend's response envelope and error codes.
 *
 * Kept in sync manually with /backend/src/common/constants/error-codes.ts.
 * When we add a shared package later, this duplication goes away.
 */

export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  meta: { requestId: string };
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: { requestId: string };
}

export const ErrorCode = {
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  ONBOARDING_REQUIRED: 'ONBOARDING_REQUIRED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Thrown by the API client for every non-2xx response (and network failures).
 * Catch with `error instanceof ApiError` and read `.code` to branch.
 */
export class ApiError extends Error {
  readonly code: ErrorCode | string;
  readonly httpStatus: number | null;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(params: {
    code: ErrorCode | string;
    message: string;
    httpStatus: number | null;
    details?: unknown;
    requestId?: string;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.code = params.code;
    this.httpStatus = params.httpStatus;
    this.details = params.details;
    this.requestId = params.requestId;
  }

  is(code: ErrorCode): boolean {
    return this.code === code;
  }
}
