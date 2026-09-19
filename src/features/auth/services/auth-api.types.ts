import type {
  AuthSession,
  OtpChallenge,
  TokenResponse,
  UserProfile,
} from '../types/auth.types';

export type AuthTokenDataDto = {
  access_token: string;
  refresh_token: string;
  expire_in?: number;
  auth_type?: string;
};

export type UserProfileDataDto = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type OtpChallengeDataDto = {
  challenge_id: string;
  expires_in: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function unwrapData(response: unknown): unknown {
  if (isRecord(response) && 'data' in response && response.data !== undefined) {
    return response.data;
  }
  return response;
}

export function parseTokenData(value: unknown): TokenResponse {
  const data = unwrapData(value);
  if (!isRecord(data)) {
    throw new Error('Malformed token response: expected an object.');
  }

  const accessToken = data.access_token ?? data.accessToken;
  const refreshToken = data.refresh_token ?? data.refreshToken;

  if (typeof accessToken !== 'string' || accessToken.trim().length === 0) {
    throw new Error(
      'Malformed token response: access_token is missing or empty.',
    );
  }

  if (typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
    throw new Error(
      'Malformed token response: refresh_token is missing or empty.',
    );
  }

  return {
    accessToken,
    refreshToken,
  };
}

export function parseUserProfile(value: unknown): UserProfile {
  const data = unwrapData(value);
  if (!isRecord(data)) {
    throw new Error('Malformed user profile response: expected an object.');
  }

  const id = data.id;
  const email = data.email;
  const displayName = data.displayName ?? data.display_name;
  const avatarUrl =
    data.avatarUrl !== undefined
      ? (data.avatarUrl as string | null)
      : data.avatar_url !== undefined
      ? (data.avatar_url as string | null)
      : null;

  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Malformed user profile: id is missing or empty.');
  }

  if (typeof email !== 'string' || email.trim().length === 0) {
    throw new Error('Malformed user profile: email is missing or empty.');
  }

  if (typeof displayName !== 'string' || displayName.trim().length === 0) {
    throw new Error('Malformed user profile: displayName is missing or empty.');
  }

  return {
    id,
    email,
    displayName,
    avatarUrl,
  };
}

export function parseOtpChallengeResponse(response: unknown): OtpChallenge {
  const data = unwrapData(response);
  if (!isRecord(data)) {
    throw new Error('Malformed OTP challenge response: expected an object.');
  }

  const challengeId = data.challenge_id ?? data.challengeId;
  const expiresIn = data.expires_in ?? data.expiresIn;

  if (typeof challengeId !== 'string' || challengeId.trim().length === 0) {
    throw new Error(
      'Malformed OTP challenge response: challenge_id is missing.',
    );
  }

  if (typeof expiresIn !== 'number' || Number.isNaN(expiresIn)) {
    throw new Error(
      'Malformed OTP challenge response: expires_in must be a number.',
    );
  }

  return {
    challengeId,
    expiresInSeconds: expiresIn,
  };
}

export function parseAuthSessionResponse(response: unknown): AuthSession {
  const data = unwrapData(response);
  if (!isRecord(data)) {
    throw new Error('Malformed auth session response: expected an object.');
  }

  const tokens = parseTokenData(data);

  if (!data.user) {
    throw new Error(
      'Malformed auth session response: user profile is missing. Fake user fallback is rejected.',
    );
  }

  const user = parseUserProfile(data.user);

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}
