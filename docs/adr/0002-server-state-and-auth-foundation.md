# ADR-0002: Server State, Authentication, and Secure Storage Foundation

- Status: Superseded in part by [ADR-0013](0013-standardized-api-feature-hooks-boundary.md)
- Date: 2026-09-14 (Updated 2026-09-19)
- Owners: JUJISTU mobile architecture team

> [!NOTE]
> Sections 1 and 2 of this ADR describing `<feature>/queries`, `api-client.ts`, and direct query mutation usage in UI have been superseded by [ADR-0013](0013-standardized-api-feature-hooks-boundary.md). Shared HTTP transport is now unified in `http-client.ts` (`apiRequest`), remote operations are encapsulated in `services/`, and UI strictly interacts with `hooks/` facades.

## Context

Following the establishment of the React Native 0.87.1 CLI baseline (ADR-0001),
the application requires production-ready infrastructure for server state caching,
typed network requests, authentication session management, and credential security.

## Decisions

### 1. Server State: TanStack Query v5

- Use `@tanstack/react-query` (`^5.100.6`) as the primary remote/server state solution.
- Centralize query keys per feature in `<feature>/queries/<feature>.keys.ts`.
- Use `useQuery` for reads and `useMutation` for writes/side effects.
- Server data must never be duplicated into client state managers (such as Redux).
- React Native defaults applied in `createQueryClient()`:
  - `staleTime`: 5 minutes to reduce unnecessary cellular requests.
  - `retry`: 2 for queries, disabled for mutations to prevent duplicate side effects.
  - `refetchOnWindowFocus`: disabled (web focus semantics do not map to mobile).
  - `refetchOnReconnect`: enabled.

### 2. Shared API Infrastructure

- Generic HTTP transport implemented using platform `fetch` in `src/shared/services/api/api-client.ts`.
- Business endpoints must never live inside the shared API client; they belong strictly in feature API modules (`src/features/<feature>/api/`).
- HTTP status codes are normalized to the shared `AppError` hierarchy (`ValidationError`, `AuthenticationError`, `ForbiddenError`, `NotFoundError`, `RateLimitError`, `ServerError`).
- Screens must never call HTTP clients directly (`fetch`, `axios`, or `apiClient`). Data flow:
  `Screen -> Feature Query Hook -> Feature API -> Shared API Client -> Backend`.

### 3. Authentication & Credential Storage

- Authentication mechanism: JWT token pair (`accessToken` + `refreshToken`).
- Sensitive credentials (`accessToken`, `refreshToken`) stored securely using `react-native-keychain` (Android Keystore / iOS Keychain). Passwords must never be stored.
- Feature code must never import `react-native-keychain` directly; all credential access is guarded behind the `tokenManager` abstraction (`src/shared/services/api/token-manager.ts`).
- Single-flight refresh lock (`src/shared/services/api/refresh-token.ts`) prevents concurrent 401 refresh storms by deduplicating requests onto a single inflight Promise.
- On refresh failure, local session credentials and auth query caches are purged atomically.

### 4. Navigation Architecture

- `RootNavigator` conditionally switches between `AuthNavigator` and `MainNavigator` based on reactive session state (`useAuthState`).
- Avoid premature `BottomTabs` with a single tab; `MainNavigator` begins as a typed stack with `HomeScreen` until ≥2 confirmed business features require tabs.
- Initial auth flows provide `LoginScreen` and `RegisterScreen` in `features/auth`.

### 5. Platform Validation

- Android toolchain and debug APK compilation (`:app:assembleDebug`) verified with `react-native-keychain`.
- iOS source compatibility maintained; native build validation remains **PENDING MACOS VALIDATION**.
