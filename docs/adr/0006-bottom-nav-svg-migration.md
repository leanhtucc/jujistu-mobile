# ADR-0006: Bottom Navigation PNG → SVG/AppIcon Migration

- Status: Accepted
- Date: 2026-09-16
- Owners: JUJISTU mobile team

## Context

`AppBottomNavigation` v1 was shipped with ten PNG assets (`*-active.png`,
`*-inactive.png`) rendered via React Native `<Image>` inside a fixed 36×36 icon
slot. The SVG-first Icon Pipeline V2 (ADR-0004) is established and the glyph
registry contains 6 verified shared-UI icons.

The product requires migrating all ten tab icons to SVG-backed TSX glyphs
consumed through `AppIcon`, eliminating the PNG dependency from the navigation
bar while preserving the five-tab layout, active gradient label, and all
accessibility attributes.

## Decisions

### 1. Ten SVG source files — two new conventions

Ten named SVGs are created in `assets/icons/tabs/` following the
`{name}-{state}.svg` convention:

- **FIXED_VISUAL** (home, tournament, mission — active + inactive): SVG files
  wrapping Figma-exported raster artwork as embedded `<image href="data:image/png;base64,…"/>` elements. The active-state files (`ic_home.svg`,
  `ic_tournament.svg`, `ic_mission.svg`) are the Figma canonical exports.
  Inactive-state files embed the corresponding `*-inactive.png` files.

- **MONOCHROME_VECTOR** (shop, friends — active + inactive): Vector-path SVGs
  derived from the Figma exports (`ic_shop.svg`, `ic_friends.svg`). Active
  variants substitute `#CCD5E6` → `#FE8B33` (brand orange). Inactive variants
  keep `#CCD5E6`.

No icons are traced, redrawn, or imported from external design systems.

### 2. Generator and glyph naming

`npm run icons:generate` produces 10 new TSX files in
`src/ui/atoms/icon/glyphs/tabs/` using the existing `@svgr/cli` pipeline.
Glyph names follow the `{Name}{State}Glyph` pattern
(`HomeActiveGlyph`, `ShopInactiveGlyph`, …).

### 3. Registry expansion: 6 → 16 keys

The static `glyphs.ts` registry is expanded with ten new keys:
`homeActive`, `homeInactive`, `shopActive`, `shopInactive`,
`tournamentActive`, `tournamentInactive`, `missionActive`, `missionInactive`,
`friendsActive`, `friendsInactive`.

The existing six shared-UI keys are unchanged.

### 4. Discriminated-union icon slot type

`BottomNavigationItemData.activeIcon / inactiveIcon` previously accepted only
`BottomNavigationImageSource` (with `source: ImageSourcePropType`). A new
interface `BottomNavigationIconNameSource` is introduced and the two are unified
under `BottomNavigationIconSlot`:

```ts
type BottomNavigationIconSlot =
  | BottomNavigationImageSource // legacy PNG path (backward-compatible)
  | BottomNavigationIconNameSource; // new SVG/AppIcon path
```

Discrimination is performed at runtime by `'iconName' in slot`.

### 5. BottomNavigationItem render path

`BottomNavigationItem` now renders `<AppIcon>` when the slot carries an
`iconName`, and falls back to `<Image>` for any remaining legacy slots.
This preserves full backward compatibility for consumers that have not yet
migrated to the `iconName` slot.

### 6. Product tab-icon-assets migration

This mapping lives at `src/app/navigation/tab-icon-assets.ts` because it configures
application-wide destinations (ADR 0012). It uses
`BottomNavigationIconNameSource` exclusively. FIXED_VISUAL glyphs carry
only `iconName` and `size`; MONOCHROME_VECTOR glyphs additionally carry
`color` to distinguish active/inactive states without changing glyph code.

### 7. Legacy PNGs deleted

The ten `*-active.png` / `*-inactive.png` files in `assets/icons/tabs/` have been
removed. The navigation bar operates exclusively on the SVG-backed `AppIcon`
pipeline.

## Consequences

- **Positive**: Navigation bar icons are now part of the unified SVG pipeline.
- **Positive**: Zero new runtime packages; existing `react-native-svg` and
  `AppIcon` infrastructure is reused.
- **Positive**: `IconName` union grows from 6 to 16 — fully type-safe.
- **Positive**: Backward-compatible: existing consumers passing
  `BottomNavigationImageSource` continue to compile and render.
- **Positive**: Removed 10 unused PNG raster files from `assets/icons/tabs/`.
- **Negative**: FIXED_VISUAL glyphs embed base64 rasters (home-active ~10 KB,
  mission-active ~17 KB). These are substantially smaller than the existing
  `ic_coin.tsx` (~2.2 MB) and `ic_gem.tsx` (~956 KB), so bundle impact is
  acceptable.
