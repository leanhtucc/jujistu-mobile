import { useSyncExternalStore } from 'react';

import type { PurchasedTicket } from '../types/ticket.types';

/**
 * In-memory store for the ticket bought in this session. It stands in for the
 * ticket service so the purchase and "my ticket" screens share one source; it
 * is replaced by a feature hook backed by the API.
 */
let current: PurchasedTicket | null = null;
let purchases = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPurchasedTicket(): PurchasedTicket | null {
  return current;
}

export function savePurchasedTicket(ticket: PurchasedTicket): void {
  current = ticket;
  purchases += 1;
  emit();
}

/** Seed for the next ticket, stable and distinct per purchase. */
export function nextTicketSeed(): number {
  return 4217 + purchases * 101;
}

export function resetTicketStore(): void {
  current = null;
  purchases = 0;
  emit();
}

export function usePurchasedTicket(): PurchasedTicket | null {
  return useSyncExternalStore(
    subscribe,
    getPurchasedTicket,
    getPurchasedTicket,
  );
}
