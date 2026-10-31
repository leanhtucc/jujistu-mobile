# ADR 0018: Adopt the Jujitsu Mobile Design System Foundation

- Status: Accepted
- Date: 2026-10-30
- Supplements: ADR 0005 (UI design system layer), ADR 0017 (Home v4)

## Context

The canonical product design is the "Jujitsu App v4" prototype together with the
"Jujitsu Mobile Design System" ("Gi & Belt"). Home v4 is implemented, but the
Shop, Tournaments, Athletes, Missions and Tickets screens are still placeholders.
Building them needs the system's shared language first: type roles, radii,
motion, and the signature components.

The runtime theme still described Barlow typography and had no card, tag, chip,
progress bar, avatar, segmented control or bottom sheet.

## Decision

1. **Typography.** Add three families to `fontFamilies`: `heading`
   (Bricolage Grotesque Bold/ExtraBold), `body` (Be Vietnam Pro
   Regular/Medium/SemiBold) and `mono` (JetBrains Mono Medium). New design-system
   roles live in `dsTypography` (`display`, `title`, `stat`, `body`,
   `bodyStrong`, `overline`, `counter`). Existing `typography` and
   `componentTypography` (Barlow) are unchanged and are migrated screen by screen.
2. **Tokens.** Add radii `card` 14, `banner` 20, `sheet` 28; spacing `gutter` 20,
   `stack` 12, `section` 32; and `motionDuration` / `motionEasing`
   (`grip`, `release`, `sweep`, `spring`).
3. **Components.** Add to `src/ui`:
   - atoms: `AppTag`, `AppProgressBar`, `AppAvatar` (optional belt strap, reusing
     `AppBeltBar`);
   - molecules: `AppCard` (lapel cut and stitched seam), `AppChip`,
     `AppSegmentedControl`, `AppBottomSheet`.
4. **No new status colours.** The system has no success/warning/info colours;
   the neutral fallback in `docs/design-system.md` stays in force.
5. **Icons.** Phosphor glyphs continue to enter through the SVG registry
   (ADR 0004). No icon font or runtime icon package is added.

## Consequences

- Font files (`BricolageGrotesque-Bold/ExtraBold`, `BeVietnamPro-Regular/Medium/SemiBold`,
  `JetBrainsMono-Medium`, all SIL OFL, licences beside them) live in `assets/fonts/`
  and are copied to `ios/JUJISTU/Fonts` and `android/app/src/main/assets/fonts`, as
  Barlow is. iOS lists them in `UIAppFonts` and the Xcode project. Their PostScript
  and file names equal the `fontFamilies` values. No Android or iOS build has been
  run, so rendering on device is unverified.
- Barlow stays linked until every screen has migrated; removing it is a later,
  separate change.
- `AppCard` `cutColor` must equal the colour behind the card, because the lapel
  fold is drawn as a cut rather than a true clipped path.
- The belt-tip primary button was added later (`AppButton` `beltTip`, see ADR 0019).
