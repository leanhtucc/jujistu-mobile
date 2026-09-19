# ADR-0013: Standardized API Integration and Feature Hooks Boundary

- Status: Accepted
- Date: 2026-09-19
- Owners: JUJISTU mobile architecture team
- Supersedes: In part [ADR-0002](0002-server-state-and-auth-foundation.md) (shared HTTP transport, feature API layer, and query hook boundary)

## Context

ADR-0002 established TanStack Query v5, Keychain-backed `tokenManager`, and single-flight 401 refresh. However, subsequent evolution revealed architectural drift:

1. **Duplicate HTTP Transports**: Both `api-client.ts` and `http-client.ts` co-existed in `src/shared/services/api/`, with divergent timeout, 401 interceptor, and activity tracking implementations.
2. **Leaky Server-State Details**: Screens and components imported directly from `<feature>/queries` and manipulated raw mutation/query objects (`mutate`, `isPending`, `error`, `reset`).
3. **Overly Broad Feature Surface**: Feature index files exported raw API modules (`authApi`) and internal query keys (`authKeys`).
4. **DTO Placement**: Authentication wire DTOs resided in `src/shared/services/api/schema.ts`, leaking domain specifics into shared transport infrastructure.
5. **Rules of Hooks Boundary**: Infrastructure bridges connecting runtime auth tokens to the HTTP transport required a strictly compliant hook contract to prevent calling hooks outside React render.

## Decisions

### 1. Unified Shared HTTP Transport (`http-client.ts`)

- `src/shared/services/api/http-client.ts` (`apiRequest`) is the sole HTTP transport for JUJISTU.
- Legacy `api-client.ts` is eliminated. Configurable timeout (`API_TIMEOUT_MS`), `combineAbortSignals`, and 204 No Content handling are consolidated into `http-client.ts`.
- Shared transport handles generic HTTP concerns only: base URL resolution, headers, request serialization, cancellation, safe logging redaction, error normalization (`AppError`), and single-bounded 401 retry.
- Business endpoints and domain DTOs must never live in the shared transport layer.

### 2. Feature Services (`src/features/<feature>/services/`)

- Remote interactions are encapsulated in feature services as plain async TypeScript functions.
- Services own endpoint path resolution, request payload serialization, boundary validation, and DTO-to-domain transformation.
- Responses from external networks must be parsed safely from `unknown` via type guards; bare type assertions and synthetic fallback users (e.g. `usr_default`) are forbidden.
- Feature services are private to the feature and are never exported from the feature's public `index.ts`.

### 3. Feature Hooks as the Sole UI Facade (`src/features/<feature>/hooks/`)

- Screens and UI components must interact with server state exclusively through feature hooks.
- Feature hooks own TanStack Query lifecycle (`useQuery`, `useMutation`), cache key management, invalidations, and side effects (such as token persistence).
- Feature hooks return stable, semantic, UI-facing contracts (e.g., `{ requestOtp, isSubmitting, error, clearError }`) rather than leaking raw TanStack Query objects.
- Query keys are private implementation details residing in `<feature>/hooks/*-query-keys.ts` and are never exposed publicly.

### 4. Auth Session and Transport Bridge

- An explicit hook `useAuthTransportBridge` supplies stable callbacks (`getAccessToken`, `refreshSession`) to `ApiAccessTokenBridge`.
- HTTP interceptors receive plain callback functions registered during render lifecycle; hooks are never invoked within network callbacks.
- Single-flight refresh token lock (`refreshAccessToken`) is preserved, executing token rotation atomically and clearing local credentials on refresh failure.

### 5. Architectural Enforcement

- `scripts/check-architecture.js` validates that screens and visual components do not import shared API clients, feature services, or raw query modules directly.
- Feature `index.ts` files are forbidden from exporting query keys, services, or internal DTOs.

## Consequences

- **Positive**: Clean separation of concerns; UI components are completely decoupled from TanStack Query internals and wire DTO shapes.
- **Positive**: Single HTTP transport eliminates confusion between `apiClient` and `http-client`.
- **Positive**: Robust security and reliable session lifecycle without fake user fallbacks.
- **Trade-off**: Requires small wrapper contracts in feature hooks instead of directly returning `useMutation()`.
