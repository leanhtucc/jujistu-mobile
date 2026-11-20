# home

Home tab (ADR-0011, ADR-0017). A composition of sections; it owns no remote state.

- `HomeScreen` lays out the header, hero carousel, quick actions, upcoming tournament,
  recap, tickets, videos, athlete spotlight, news and products.
- Every tap is reported through an `on*` prop. `src/app/navigation/MainNavigator.tsx`
  decides where it goes (tournament detail, athlete journey, videos, tickets, shop
  tab, missions tab).
- `mode` (`guest` or `authenticated`) is accepted by `HomeScreen` and `HomeQuickActions`
  but not used yet.
- `resolveHome*Geometry` functions are pure layout maths per window width (ADR-0010).
- `onReady` / `onInitialImageSettled` feed the startup readiness signal (ADR-0009).
- Static content lives in `data/home-content.ts`.
