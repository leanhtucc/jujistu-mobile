# athletes

Athlete directory and an athlete's journey (career, stats, rivals).

```text
AthleteListScreen -> useAthleteList (query + discipline filter) -> Spotlight / Row
        | onSelectAthlete(id)
AthleteJourneyScreen -> useAthleteProfile -> Hero / Stats / Rivals / CareerTimeline
        | onPressVideo -> videos
```

- The spotlight card shows only while no search or filter is active.
- An athlete without a published journey raises a timed notice instead of navigating.
- Filtering logic lives in `data/athlete-selectors.ts`.
- **Mock seam (ADR-0019):** data is static.
