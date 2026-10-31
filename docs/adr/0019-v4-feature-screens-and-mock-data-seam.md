# ADR 0019: v4 Feature Screens and the Mock-Data Seam

- Status: Accepted
- Date: 2026-10-31
- Supplements: ADR 0017 (Home v4), ADR 0018 (design system foundation)

## Context

After Home v4 (ADR 0017) and the design-system foundation (ADR 0018), the Shop,
Tournaments, Athletes, Missions and Tickets destinations were placeholders. The
"Jujitsu App v4" prototype defines them, but no backend exists yet for any of
them.

## Decision

1. **Screens.** Each destination is owned by its feature under `src/features/`
   (`tournaments`, `athletes`, `missions`, `shop`, `tickets`) with the standard
   folders: `screens/`, `components/`, `hooks/`, `data/`, `types/`. A new
   `notifications` feature owns the notification centre.
2. **Mock-data seam.** Static content lives in each feature's `data/`
   (`*-content.ts`) and pure derivations in `data/*-selectors.ts`. Screens and
   components call only the feature hook (`use-tournament-list`,
   `use-athlete-profile`, `use-missions`, `use-shop`, `use-ticket-purchase`,
   `use-notifications`, ...). When an API exists, the hook switches to TanStack
   Query over a feature service (ADR 0013) and its returned shape stays the
   same, so screens do not change. Mock-only conveniences are marked in code:
   the reference "today" (`TOURNAMENT_MOCK_TODAY`), mock checkout and payment
   delays, and the in-memory ticket store (`ticket-store.ts`).
3. **Wallet.** The coin balance is owned by the app shell
   (`MainNavigator`), not by a feature. Home shows it; Missions receives it as
   `coins` and reports rewards through `onEarn`. A feature used without these
   props keeps a local balance.
4. **Navigation targets.** Notifications carry a `NotificationTarget`; the app
   maps it to a route or tab. Features do not import navigation.
5. **Phase 1 scope.** The bracket tab, favourites, predictions, quizzes, clubs,
   rankings and mini games are out of scope and not built.
6. **Motion.** Stamps land with `AppStampIn` (spring, honours "reduce motion").
   The filled primary button may end in a belt tip (`beltTip`). Neither adds an
   infinite loop.

## Consequences

- Everything user-visible in these screens is mock data: tickets and orders live
  in memory and are lost on restart, payments are simulated, and QR codes are
  decorative and not scannable.
- Wallet changes caused by shop or ticket purchases are not reflected yet;
  only mission and streak rewards move the balance.
- Existing per-feature transient messages (athletes, missions, shop) keep their
  own timers; `useTransientMessage` in `src/shared/hooks` is used by tickets and
  is the intended replacement.
- No Android or iOS build has run, so layout, fonts and animation on device are
  unverified.
