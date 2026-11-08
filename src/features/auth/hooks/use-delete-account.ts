import { tokenManager } from '@jujistu/shared/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { deleteAccount as deleteAccountService } from '../services/auth-service';
import { authQueryKeys } from './auth-query-keys';

export interface UseDeleteAccountResult {
  deleteAccount: () => Promise<{ success: boolean; message: string }>;
  isSubmitting: boolean;
  isSuccess: boolean;
}

/**
 * Public hook for account deletion request.
 * Required by Vietnam Law on Personal Data Protection (Luật 91/2025/QH15, Điều 14;
 * Nghị định 356/2025/NĐ-CP, Điều 5; vn-law-check Checklist 09 mục C).
 * Ensures session tokens and auth caches are purged upon request.
 */
export function useDeleteAccount(): UseDeleteAccountResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { success: boolean; message: string },
    Error,
    void
  >({
    mutationFn: async () => {
      return await deleteAccountService();
    },
    onSettled: async () => {
      await tokenManager.clearTokens();
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
    },
  });

  const deleteAccount = useCallback(async () => {
    return await mutation.mutateAsync();
  }, [mutation]);

  return {
    deleteAccount,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
}
