/**
 * Centralized TanStack Query keys for authentication and current user server state.
 */
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
};
