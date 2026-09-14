import { createQueryClient } from '@jujistu/shared/services/api/query-client';

describe('createQueryClient', () => {
  it('creates a QueryClient with RN-optimized defaults', () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions();

    expect(defaults.queries?.staleTime).toBe(5 * 60 * 1000);
    expect(defaults.queries?.retry).toBe(2);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaults.queries?.refetchOnReconnect).toBe(true);
  });

  it('disables automatic retry for mutations', () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions();

    expect(defaults.mutations?.retry).toBe(false);
  });

  it('returns a new instance on each call', () => {
    const client1 = createQueryClient();
    const client2 = createQueryClient();

    expect(client1).not.toBe(client2);
  });
});
