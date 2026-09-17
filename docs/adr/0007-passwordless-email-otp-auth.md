# ADR-0007: Passwordless Email OTP Authentication

- Status: Accepted
- Date: 2026-09-17
- Owners: JUJISTU mobile team

## Context

The approved authentication experience collects an email address and verifies a
six-digit one-time passcode. The original foundation screens used email and
password only as a temporary infrastructure baseline.

## Decision

- The guest flow is `Welcome -> Login -> Otp`.
- Login requests an OTP challenge using an email address.
- OTP verification returns the existing JWT access-token and refresh-token session.
- Only the challenge identifier and email are passed as serializable navigation
  parameters. OTP codes and tokens are never placed in navigation state or logs.
- The OTP screen is presented as a transparent modal and automatically verifies
  after six digits are entered.
- Resend is rate-limited in the UI with a 30-second countdown. The backend remains
  authoritative for actual rate limits and expiry.
- Until backend URLs are configured, development uses the existing typed mock API.
  Production endpoint contracts must be aligned with the backend specification
  before release.

## Consequences

- Password registration remains outside the active guest navigation flow.
- Authentication still stores credentials only through the shared Keychain/Keystore
  token manager.
- Android and iOS accessibility, keyboard, autofill, and modal behavior require
  platform validation.
