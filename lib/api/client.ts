import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/lib/config/env';
import type { StoredTokens } from '@/lib/auth/tokenStorage';
import {
  ApiError,
  ApiErrorEnvelope,
  ApiSuccessEnvelope,
  ErrorCode,
} from './types';

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

export interface AuthHandlers {
  /** Read the currently stored token pair (or null if signed out). */
  getTokens: () => Promise<StoredTokens | null>;
  /** Persist a refreshed token pair. */
  onTokensRefreshed: (tokens: StoredTokens) => Promise<void>;
  /** Called when refresh fails — caller should clear tokens and route to welcome. */
  onAuthFailed: () => Promise<void> | void;
}

let handlers: AuthHandlers | null = null;

/**
 * The auth store calls this once at module load so the API client can read
 * tokens, persist refreshed pairs, and notify on auth failure. Keeps `lib/`
 * decoupled from `features/`.
 */
export function setAuthHandlers(h: AuthHandlers): void {
  handlers = h;
}

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ---------- Request: attach Bearer token ----------
api.interceptors.request.use(async (config) => {
  const tokens = await handlers?.getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// ---------- Response: unwrap envelope, refresh on AUTH_TOKEN_EXPIRED ----------
api.interceptors.response.use(
  (response) => unwrapSuccess(response),
  async (error: AxiosError<ApiErrorEnvelope>) => {
    const apiError = toApiError(error);
    const config = error.config as RetryableConfig | undefined;

    if (
      apiError.is(ErrorCode.AUTH_TOKEN_EXPIRED) &&
      config &&
      !config._retried
    ) {
      config._retried = true;
      try {
        const fresh = await refreshOnce();
        config.headers.Authorization = `Bearer ${fresh.accessToken}`;
        return api(config);
      } catch {
        await handlers?.onAuthFailed();
        throw apiError;
      }
    }

    if (
      apiError.is(ErrorCode.AUTH_TOKEN_INVALID) ||
      apiError.is(ErrorCode.AUTH_UNAUTHORIZED)
    ) {
      await handlers?.onAuthFailed();
    }

    throw apiError;
  },
);

// ---------- Single-flight refresh ----------
let refreshInflight: Promise<StoredTokens> | null = null;

async function refreshOnce(): Promise<StoredTokens> {
  if (refreshInflight) return refreshInflight;
  refreshInflight = (async () => {
    try {
      const tokens = await handlers?.getTokens();
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }
      // Bare axios call — bypasses our interceptors so we don't recurse.
      const res = await axios.post<ApiSuccessEnvelope<StoredTokens>>(
        `${env.apiUrl}/v1/auth/refresh`,
        { refreshToken: tokens.refreshToken },
        { timeout: 15_000 },
      );
      const fresh: StoredTokens = {
        accessToken: res.data.data.accessToken,
        refreshToken: res.data.data.refreshToken,
      };
      await handlers?.onTokensRefreshed(fresh);
      return fresh;
    } finally {
      refreshInflight = null;
    }
  })();
  return refreshInflight;
}

// ---------- Helpers ----------

function unwrapSuccess(response: AxiosResponse): AxiosResponse {
  const body = response.data;
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    body.success === true &&
    'data' in body
  ) {
    response.data = (body as ApiSuccessEnvelope<unknown>).data;
  }
  return response;
}

function toApiError(error: AxiosError<ApiErrorEnvelope>): ApiError {
  // Server responded with our standard error envelope
  if (error.response?.data && typeof error.response.data === 'object') {
    const body = error.response.data as ApiErrorEnvelope;
    if (body.success === false && body.error) {
      return new ApiError({
        code: body.error.code,
        message: body.error.message,
        httpStatus: error.response.status,
        details: body.error.details,
        requestId: body.meta?.requestId,
      });
    }
  }

  // Server responded but not in our envelope (proxy error, server crash before filter)
  if (error.response) {
    return new ApiError({
      code: ErrorCode.UNKNOWN,
      message: error.response.statusText || 'Request failed',
      httpStatus: error.response.status,
    });
  }

  // No response — network or timeout
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiError({
      code: ErrorCode.TIMEOUT,
      message: 'The request timed out. Please try again.',
      httpStatus: null,
    });
  }

  return new ApiError({
    code: ErrorCode.NETWORK_ERROR,
    message:
      'Could not reach the server. Check your connection and try again.',
    httpStatus: null,
  });
}
