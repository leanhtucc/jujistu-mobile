/**
 * Global counter of in-flight API requests, exposed to React through useSyncExternalStore.
 * http-client updates it per request; consumers can show a loading overlay from it and
 * temporarily suppress that overlay.
 */
import { useSyncExternalStore } from 'react';

let activeApiRequestCount = 0;
let apiLoadingOverlaySuppressionCount = 0;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach(listener => {
    listener();
  });
}

/** Marks a request as started and returns an idempotent `release` function to call when it ends. */
export function trackApiRequestActivity() {
  activeApiRequestCount += 1;
  emitChange();

  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;
    activeApiRequestCount = Math.max(0, activeApiRequestCount - 1);
    emitChange();
  };
}

/** Current number of in-flight requests. */
export function getActiveApiRequestCount() {
  return activeApiRequestCount;
}

/** Hides the loading overlay until the returned function is called (calls are counted). */
export function suppressApiLoadingOverlay() {
  apiLoadingOverlaySuppressionCount += 1;
  emitChange();

  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;
    apiLoadingOverlaySuppressionCount = Math.max(
      0,
      apiLoadingOverlaySuppressionCount - 1,
    );
    emitChange();
  };
}

/** True while at least one suppression is active. */
export function getIsApiLoadingOverlaySuppressed() {
  return apiLoadingOverlaySuppressionCount > 0;
}

/** Subscribes to count/suppression changes; returns the unsubscribe function. */
export function subscribeToApiRequestActivity(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/** React hook for the in-flight request count. */
export function useActiveApiRequestCount() {
  return useSyncExternalStore(
    subscribeToApiRequestActivity,
    getActiveApiRequestCount,
    getActiveApiRequestCount,
  );
}

/** React hook for whether the loading overlay is currently suppressed. */
export function useIsApiLoadingOverlaySuppressed() {
  return useSyncExternalStore(
    subscribeToApiRequestActivity,
    getIsApiLoadingOverlaySuppressed,
    getIsApiLoadingOverlaySuppressed,
  );
}
