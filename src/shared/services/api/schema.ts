/**
 * Shared API generic envelope for backend communication.
 *
 * Feature-specific wire DTOs belong strictly inside their respective
 * feature directories (e.g. `src/features/<feature>/services/*-api.types.ts`).
 */

export type ApiEnvelope<TData = unknown> = {
  data?: TData;
  message: string;
  status: number;
  success: boolean;
};
