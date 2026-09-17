# JUJISTU Design System Documentation

Comprehensive architecture, component inventory, design tokens, icon pipeline, and consumption guide for the JUJISTU mobile application.

---

## 1. Component Inventory & Public Import Guide

All Design System components and public types are exported from the single root entry point:

```typescript
import {
  // Atoms
  AppIcon,
  AppButton,
  AppIconButton,
  AppInputField,
  AppOtpField,
  AppDivider,
  AppOverlay,
  AppPaginationDot,
  AppPasswordDot,
  AppProgress,
  AppToggle,
  AppCheckbox,
  AppRadio,

  // Molecules
  AppAnswerOption,
  AppSelectionTile,
  AppTab,
  AppTabList,
  AppToast,
  AppTooltip,

  // Organisms
  AppHeader,
  AppBottomNavigation,
} from '@jujistu/ui';
```

Product-specific compositions (such as `ProductAccountHeader`) are owned by the application layer at `src/app/components/` and import `@jujistu/ui` primitives.

---

## 2. Atomic Design Hierarchy

The design system is structured strictly into atomic design layers (`src/ui/`):

### Atoms (`src/ui/atoms/`)

Smallest reusable visual primitives that cannot be broken down further without losing their standalone meaning:

- **`AppIcon`**: SVG glyph renderer supporting the verified icon registry.
- **`AppButton`**: Primary button with gradient, secondary dark/light, filled/outline/ghost/soft appearances, sm/md/lg sizes, loading indicator, and icon slots.
- **`AppIconButton`**: Dedicated square icon button reusing button visual recipes (sm: 40px, md: 44px, lg: 56px).
- **`AppInputField`**: Single-line text input with sm (40px), md (52px), and lg (62px) sizes, gradient focus border, error state, and secure text entry.
- **`AppOtpField`**: Multi-cell OTP code input with invisible native `TextInput` overlay, paste normalization, and sm/md/lg cell geometry.
- **`AppDivider`**: Horizontal or vertical separator line.
- **`AppOverlay`**: Semi-transparent backdrop surface for modals, popups, and drawer sheets.
- **`AppPaginationDot`**: Carousel / onboarding step indicator dots.
- **`AppPasswordDot`**: Visual PIN/password dot indicators.
- **`AppProgress`**: Progress step segment representing discrete step status (`completed` with primary gradient fill, or `upcoming` with subtle surface).
- **`AppToggle`**: Animated boolean switch toggle.
- **`AppCheckbox`**: Accessible check control with JUJISTU gradient fill when checked.
- **`AppRadio`**: Accessible radio selection control with circular indicator.

### Molecules (`src/ui/molecules/`)

Compositions of multiple atoms into focused interactive or feedback units:

- **`AppAnswerOption`**: Multiple-choice question option card. Supports text-only horizontal layout and image-containing vertical layout (140×140), medium (44px) and large (56px) sizes, controlled selection, and error/status feedback.
- **`AppSelectionTile`**: Interactive list tile with 64px min-height, title, subtitle/description, badge, info, optional leading icon/image, and trailing checkbox composed via `AppCheckbox`.
- **`AppTab`**: Individual navigation/filter tab with sm (40px), md (48px), lg (56px) heights, filled/soft appearances, and primary/neutral variants.
- **`AppTabList`**: Horizontal group of tabs composing `AppTab`, supporting active key selection and optional horizontal scrolling.
- **`AppToast`**: Presentational message banner supporting `style1` (inline) and `style2` (elevated push) appearances, title, message, and accessible alert announcements.
- **`AppTooltip`**: Contextual hint bubble with directional arrow indicator (`top`, `bottom`, `left`, `right`) and `solid` / `soft` styling.

### Organisms (`src/ui/organisms/`)

Complex, cohesive UI sections composed of atoms and molecules:

- **`AppHeader`**: Screen navigation bar with title, back button, and leading/trailing actions.
- **`AppBottomNavigation`**: Main bottom navigation bar displaying the 5 primary tabs (Home, Shop, Tournament, Mission, Friends) using the verified active/inactive tab asset pair pipeline.

---

## 3. Controlled vs. Presentational Contracts

To preserve architecture boundaries and avoid fragmented state:

1. **No External Store Dependencies**: No component in `@jujistu/ui` imports Redux, TanStack Query, React Navigation, or feature APIs.
2. **Controlled Inputs**:
   - `AppCheckbox`: `checked`, `onValueChange`
   - `AppRadio`: `checked`, `onPress`
   - `AppInputField`: `value`, `onChangeText`
   - `AppOtpField`: `value`, `onChangeText`
   - `AppAnswerOption`: `selected`, `onPress`
   - `AppSelectionTile`: `checked`, `selected`, `onPress`
   - `AppTab`: `selected`, `onPress`
   - `AppTabList`: `activeKey`, `onTabPress`
3. **Presentational Feedback**:
   - `AppToast`: Controlled by `visible?: boolean`. Does not bundle timers, queues, or toast managers.
   - `AppTooltip`: Controlled by `visible?: boolean`. Placement responsibility belongs to the parent container.

---

## 4. Approved JUJISTU Tokens & Barlow Typography

Tokens are defined in `src/shared/theme/`:

### Palette

- **Canvas / Background**: `canvas` (`#0C0C0C`), `canvasDeep` (`#000000`), `surface` (`#191919`), `surfaceSubtle` (`#222222`), `surfaceElevated` (`#292929`), `overlay` (`rgba(0, 0, 0, 0.80)`).
- **Text & Icon**: `primary` (`#FFFFFF`), `secondary` (`#C2C2C2`), `tertiary` (`#7D7F84`), `accent` (`#FE8B33`), `error` (`#FF3A5E`), `inverse` (`#0C0C0C`).
- **Border**: `default` (`#222222`), `subtle` (`rgba(255, 255, 255, 0.10)`), `strong` (`#3D3D3D`), `accent` (`#FE8B33`), `error` (`#FF3A5E`).
- **Action**: `primary` (`#BA2025`), `secondary` (`#292929`).
- **Gradient**: Primary action gradient from `#A70100` to `#FE8B33`.

### Typography

JUJISTU standardizes on Barlow typography across heading, body, label, and caption scales:

- Heading scales: `lg` (18px/23.4), `md` (16px/20), `sm` (14px/19.6), `xs` (12px/15).
- Body scales: `md` (14px/19.6), `sm` (12px/18).
- Label scales: `lg` (18px/27), `md` (14px/19.6), `sm` (12px/15).
- Caption scales: `sm` (10px/12), `xs` (10px/10).

---

## 5. SVG-First Icon Policy & Manual Registry

The project uses a build-time, manual glyph registry pipeline (`ADR-0004`):

- Glyphs are SVGR-compiled TypeScript components stored in `src/ui/atoms/icon/glyphs/`.
- Only verified, canonical Figma glyphs are registered in `glyphs.ts`.
- The public `IconName` type union is derived directly from `keyof typeof glyphs`.

Current Verified Glyphs:

1. `chevronLeft`: Navigation back action
2. `logOut`: Session termination
3. `settings`: Account & profile preferences
4. `gem`: Primary currency
5. `coin`: Secondary currency
6. `balanceAdd`: Currency top-up action badge

---

## 6. Status Variants & Unresolved Color Mappings

### Status Support

- **`error`**: Fully supported across all components with approved tokens (`semanticColors.status.error` / `border.error` / `text.error` `#FF3A5E`).
- **`neutral`**: Fully supported using dark surface elevations (`#191919`, `#292929`) and white text (`#FFFFFF`).
- **`selected` / `focused`**: Fully supported using brand accent tokens (`#FE8B33`).

### Documented Unresolved Statuses

The JUJISTU design system does not currently have approved semantic tokens for:

- `success` (green palette)
- `warning` (yellow/amber palette)
- `information` (blue palette)

**Handling Rule**:

1. Do not invent arbitrary hex colors.
2. Do not copy TV Design System brand colors.
3. Do not map success and warning to the brand accent as if they were finished.
4. Components (`AppToast`, `AppAnswerOption`, `AppSelectionTile`) accept the semantic status props in their API, but visually fall back to documented **neutral** styling until dedicated status tokens are approved.

---

## 7. Backward Compatibility: AppButton & AppInputField

- **`AppButton`**:
  - Preserves standard props: `label`, `variant` (`primary`, `secondaryDark`, `secondaryLight`), `size` (`sm`, `md`, `lg`), `loading`, `disabled`, `onPress`, `accessibilityLabel`.
  - Added appearances: `filled`, `outline`, `ghost`, `soft`.
  - Maintains `containerStyle` vs. inner visual surface separation.
  - Safe for all existing authentication and navigation screens.
- **`AppInputField`**:
  - Preserves standard props: `value`, `onChangeText`, `placeholder`, `secureTextEntry`, `keyboardType`, `autoCapitalize`, `autoComplete`, `containerStyle`.
  - Supports sizes `sm` (40px default), `md` (52px), and `lg` (62px).
  - Maintains SVG gradient focus border and error border.

---

## 8. Safe-Area Ownership

Ownership of screen insets follows a strict boundary:

1. **`ProductAccountHeader` does NOT own top safe area**: The component renders at a fixed 64px height. The authenticated shell or screen wrapper must apply `insets.top` padding above it.
2. **`AppBottomNavigation` does NOT own bottom safe area**: The component renders at a fixed 64px height. The main navigator shell must apply `insets.bottom` padding below it.
3. **Screen Shells Own Insets**: Screens and root layout containers use `react-native-safe-area-context` (`useSafeAreaInsets`) to manage status bar and home indicator padding.

---

## 9. Difference Between AppTab and AppBottomNavigation

| Attribute         | `AppTab` / `AppTabList`                                        | `AppBottomNavigation`                                          |
| ----------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| **Layer**         | Molecule (`src/ui/molecules/`)                                 | Organism (`src/ui/organisms/`)                                 |
| **Purpose**       | In-screen filtering, segmented controls, or sub-view switching | Application-level primary navigation between root destinations |
| **Position**      | In-flow within screen content                                  | Fixed anchored bar at bottom of authenticated shell            |
| **Anatomy**       | Pill/button with text label and optional leading/trailing icon | Fixed 5-slot tab bar with icons and tab labels                 |
| **Icon Pipeline** | Uses `AppIcon` (SVG glyph registry)                            | Uses PNG active/inactive asset pairs (`tab-icon-assets.ts`)    |
| **State**         | Parent-controlled (`activeKey`, `onTabPress`)                  | Navigator-controlled (`activeTab`, `onTabPress`)               |

---

## 10. Known Limitations

1. **No Native Rendering Verification**: Tests run in `react-test-renderer` with Node/Jest. Native iOS and Android rendering on real devices has not been executed in this environment.
2. **Large SVG Glyph Sources**: High-complexity rasterized assets (e.g. `ic_gem.tsx` and `ic_coin.tsx`) contain detailed SVG vector definitions.
3. **Missing Approved Status Colors**: `success`, `warning`, and `information` statuses fall back to neutral surfaces pending design approval of dedicated status tokens.
4. **Runtime Font Assets**: Barlow font files (`Barlow-Regular.ttf`, `Barlow-Medium.ttf`, `Barlow-SemiBold.ttf`, `Barlow-Bold.ttf`) are mapped in `typography.ts` and configured for NativeWind, but require native platform font linking for pixel-perfect device rendering.
