# tournaments

Tournament list and detail (schedule, results, medal table).

```text
TournamentListScreen -> useTournamentList -> TournamentListItem
        | onSelectTournament(id)
TournamentDetailScreen -> useTournamentDetail -> Hero / Info / tabs
        | onPressAthlete(id) -> athletes     | onPressWatch -> videos
```

- Both hooks accept an injectable `today` (the detail hook also `nowMinutes`) so tests
  do not depend on the real clock; defaults come from `data/tournament-content.ts`.
- Pure derivations (sections, status, days) live in `data/tournament-selectors.ts`.
- Navigation to other features goes out through `on*` callbacks wired in
  `src/app/navigation/MainNavigator.tsx`.
- **Mock seam (ADR-0019):** data is static.
