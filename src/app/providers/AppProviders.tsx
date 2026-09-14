import { QueryClientProvider } from '@tanstack/react-query';
import React, { type PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createQueryClient } from '@jujistu/shared/services/api/query-client';

import { ApiAccessTokenBridge } from './ApiAccessTokenBridge';

const queryClient = createQueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ApiAccessTokenBridge>{children}</ApiAccessTokenBridge>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
