/**
 * Private query keys for authentication and current user server state.
 *
 * DO NOT export from `src/features/auth/index.ts`.
 * Keys are internal implementation details of auth hooks.
 */
export const authQueryKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authQueryKeys.all, 'currentUser'] as const,
};
