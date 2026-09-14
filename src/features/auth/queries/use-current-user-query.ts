import { useQuery } from '@tanstack/react-query';

import { authApi } from '../api/auth.api';
import type { UserProfile } from '../types/auth.types';
import { authKeys } from './auth.keys';

export function useCurrentUserQuery(options?: { enabled?: boolean }) {
  return useQuery<UserProfile, Error>({
    queryKey: authKeys.currentUser(),
    queryFn: () => authApi.getCurrentUser(),
    enabled: options?.enabled,
  });
}
