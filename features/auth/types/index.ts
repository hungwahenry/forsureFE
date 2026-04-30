// Mirrors backend auth response shapes.
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export interface AuthUser {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  status: UserStatus;
  onboardingCompletedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeResponse {
  user: AuthUser;
  onboardingRequired: boolean;
}

export interface TokenPair {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface VerifyCodeResponse extends TokenPair {
  user: AuthUser;
  onboardingRequired: boolean;
}

export interface RequestCodeResponse {
  sent: true;
}
