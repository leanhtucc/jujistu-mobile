import { useSyncExternalStore } from 'react';

let activeApiRequestCount = 0;
let apiLoadingOverlaySuppressionCount = 0;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach(listener => {
    listener();
  });
}

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

export function getActiveApiRequestCount() {
  return activeApiRequestCount;
}

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

export function getIsApiLoadingOverlaySuppressed() {
  return apiLoadingOverlaySuppressionCount > 0;
}

export function subscribeToApiRequestActivity(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useActiveApiRequestCount() {
  return useSyncExternalStore(
    subscribeToApiRequestActivity,
    getActiveApiRequestCount,
    getActiveApiRequestCount,
  );
}

export function useIsApiLoadingOverlaySuppressed() {
  return useSyncExternalStore(
    subscribeToApiRequestActivity,
    getIsApiLoadingOverlaySuppressed,
    getIsApiLoadingOverlaySuppressed,
  );
}
