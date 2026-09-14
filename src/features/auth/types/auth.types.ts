/**
 * Authentication contracts and data transfer objects.
 *
 * NOTE: Backend API contracts for JUJISTU are not yet finalized.
 * The types defined below represent the architectural baseline for
 * token-based authentication (JWT access token + refresh token).
 *
 * TODO(BLOCKED): Align with finalized OpenAPI/Swagger specification when available.
 */

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly avatarUrl?: string | null;
}

export interface AuthSession {
  readonly user: UserProfile;
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterPayload {
  readonly email: string;
  readonly password: string;
  readonly displayName: string;
}

export interface TokenResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
}
