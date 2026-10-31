import { useCallback, useState } from 'react';

import { NOTIFICATIONS } from '../data/notification-content';
import type {
  NotificationItem,
  NotificationTarget,
} from '../types/notification.types';

export interface UseNotificationsResult {
  readonly items: readonly NotificationItem[];
  readonly hasUnread: boolean;
  readonly isOpen: boolean;
  /** Opens the centre and marks everything as read. */
  readonly open: () => void;
  readonly close: () => void;
  /** Closes the centre and reports where the notification leads. */
  readonly select: (
    item: NotificationItem,
    onNavigate?: (target: NotificationTarget) => void,
  ) => void;
}

export function useNotifications(): UseNotificationsResult {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const open = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const select = useCallback(
    (
      item: NotificationItem,
      onNavigate?: (target: NotificationTarget) => void,
    ) => {
      setIsOpen(false);
      onNavigate?.(item.target);
    },
    [],
  );

  return { items: NOTIFICATIONS, hasUnread, isOpen, open, close, select };
}
