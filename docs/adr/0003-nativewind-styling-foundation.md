# ADR-0003: NativeWind v4 and Tailwind CSS Styling Foundation

- Status: Accepted
- Date: 2026-09-14
- Owners: JUJISTU mobile architecture team

## Context

Following the establishment of the foundation architecture (ADR-0001) and server state/auth layers (ADR-0002), the application required a unified, performant utility-first styling system. The project adopts **NativeWind v4** backed by **Tailwind CSS v3**, referencing the established styling architecture from `tieng-viet-tv-app`.

## Decisions

### 1. Utility-First Engine: NativeWind v4 & Tailwind CSS v3

- Adopt `nativewind` (`^4.2.6`) and `tailwindcss` (`^3.4.19`).
- Use `react-native-css-interop` (`0.2.6`) as the core runtime bridge for compile-time JSX styling transformation.
- Define `./global.css` at the project root containing `@tailwind base; @tailwind components; @tailwind utilities;`.
- Configure `tailwind.config.js` with `presets: [require('nativewind/preset')]` and content matching `./App.{js,jsx,ts,tsx}` and `./src/**/*.{js,jsx,ts,tsx}`.
- Extended color system maps JUJISTU brand palette tokens (`brand`, `surface`, etc.) to utility class names while preserving theme interoperability.

### 2. Metro & Babel Integration

- **Metro Configuration**:
  - In `metro.config.js`, wrap `mergeConfig(getDefaultConfig(__dirname), config)` using `withNativeWind(..., { input: './global.css' })`.
  - Maintain path aliases (`@jujistu/app`, `@jujistu/features`, `@jujistu/shared`) seamlessly alongside NativeWind CSS compilation.
- **Babel Configuration**:
  - Runtime app builds enable `jsxImportSource: 'nativewind'` in `@react-native/babel-preset` and apply `'nativewind/babel'` (which incorporates worklets transformation).
  - Jest test environment (`api.env('test')`) isolates Babel transforms from Metro runtime CSS compilation, ensuring test execution speed and stability without requiring live bundler CSS assets.

### 3. TypeScript & Jest Test Environment Isolation

- Ambient declarations in `nativewind-env.d.ts` reference `nativewind/types` and declare wildcard `*.css` module resolution for TypeScript strict checks (`tsc --noEmit`).
- Jest configuration:
  - Map `\\.css$` to `<rootDir>/__tests__/__mocks__/styleMock.js` to avoid module resolution errors during headless testing.
  - Setup mocks for `react-native-reanimated` in `<rootDir>/__tests__/__mocks__/jestSetup.js`.
  - Ignore `/__mocks__/` paths in `testPathIgnorePatterns`.
  - Add `react-native-reanimated` and `react-native-worklets` to `transformIgnorePatterns`.

### 4. Component Refactoring & Adoption

- `HomeScreen.tsx` refactored to demonstrate NativeWind utility classes (`className="flex-1 bg-white dark:bg-black"`) alongside safe-area insets and theme tokens.
- Future presentation components should favor NativeWind `className` utilities for layout, typography, colors, and spacing.

### 5. Platform Validation

- JavaScript / TypeScript verification: `npm run verify` passed 100% across format, ESLint, architecture boundary rules, TypeScript strict typecheck, and 14 Jest test suites (71 tests).
- Metro bundling validated: `react-native bundle` on Android targets compiled `global.css` and all application components into production JS bundle with 0 errors.
- Android Gradle configuration verified for autolinked modules (`:react-native-reanimated`, `:react-native-worklets`).
- iOS source compatibility maintained; native build validation remains **PENDING MACOS VALIDATION**.
