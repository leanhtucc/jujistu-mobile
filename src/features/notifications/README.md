# notifications

Notification centre bottom sheet, opened from the Home bell.

- `useNotifications` holds `isOpen` and `hasUnread` (cleared when the centre opens).
- `select(item, onNavigate)` closes the sheet and reports `item.target`; the app shell
  maps the target to a route (`handleNotificationTarget` in `MainNavigator.tsx`).
- `NotificationCenter` is a pure view with an empty state.
- **Mock seam (ADR-0019):** items come from `data/notification-content.ts`.
