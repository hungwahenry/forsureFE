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
  getTokens: () => Promise<StoredTokens | null>;
  onTokensRefreshed: (tokens: StoredTokens) => Promise<void>;
  /** Called when refresh fails — caller should clear tokens and route to welcome. */
  onAuthFailed: () => Promise<void> | void;
}

let handlers: AuthHandlers | null = null;

// Inverted dependency: keeps `lib/` decoupled from `features/`. Auth store wires this on import.
export function setAuthHandlers(h: AuthHandlers): void {
  handlers = h;
}

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const tokens = await handlers?.getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

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

// Single-flight refresh: concurrent 401s share one in-flight request.
let refreshInflight: Promise<StoredTokens> | null = null;

async function refreshOnce(): Promise<StoredTokens> {
  if (refreshInflight) return refreshInflight;
  refreshInflight = (async () => {
    try {
      const tokens = await handlers?.getTokens();
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }
      // Bare axios — bypasses interceptors to avoid recursion.
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

  // Non-envelope response (proxy error, server crash before filter ran).
  if (error.response) {
    return new ApiError({
      code: ErrorCode.UNKNOWN,
      message: error.response.statusText || 'Request failed',
      httpStatus: error.response.status,
    });
  }

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
