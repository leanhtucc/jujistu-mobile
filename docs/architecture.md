# Source architecture

JUJISTU uses feature-based modules with lightweight dependency boundaries. Create
folders only when code has a current responsibility; an empty directory is not
architecture.

## Layers

```text
src/
├── app/                 application-wide composition
│   ├── bootstrap/       startup initialization
│   ├── navigation/      navigators, route contracts, and bottom destination config
│   ├── providers/       application providers and infrastructure bridges
│   └── App.tsx           application root composition
├── features/            user-facing capabilities grouped by feature
│   ├── auth/            authentication flows, query hooks, and screens
│   └── home/            Home content: screen, sections, data, and hooks
├── ui/                  product UI design system
│   ├── atoms/           smallest reusable visual primitives
│   ├── molecules/       compositions of atoms
│   ├── organisms/       larger reusable UI sections
│   ├── templates/       reusable screen-level layouts
│   └── utils/           UI-only helpers
└── shared/              reusable, product-agnostic infrastructure
    ├── config/          typed runtime environment configuration
    ├── errors/          structured AppError hierarchy
    ├── logger/          tagged logger with automatic PII/credential redaction
    ├── responsive.ts    window size classes and bounded responsive helpers
    ├── services/        infrastructure services
    │   └── api/         http-client, query-client, token-manager, refresh-lock
    └── theme/           colors and design tokens
```

## Dependency direction and data flow

The allowed dependency direction is:

```text
app ──────> features ──────> ui ──────> shared
 │             └──────────────────────> shared
 ├───────────────────────> ui
 └───────────────────────────────────> shared
```

- `app` may compose features, UI, and shared infrastructure.
- A feature may import its own files, `ui`, and `shared`.
- A feature must not import `app` or another feature.
- `ui` may import `shared`, but must not import `app` or a feature.
- `shared` must not import `ui`, `app`, or any feature.
- `app` imports a feature through that feature's `index.ts` public API.
- Application-wide destination configuration belongs to `app/navigation`; a feature
  must not own or import the root bottom-navigation registry.
- Feature screens remain in their feature. `app/navigation` composes their public
  entry points with application navigation without creating duplicate app screens.
- Screen components do not call `fetch`, `axios`, or a shared API client directly.

The standard data flow for remote operations is:

```text
Screen / UI Component
        ↓
Feature Hook (UI contract facade)
        ↓
Feature Service (plain async functions & DTO parsing)
        ↓
Shared HTTP Transport (http-client.ts / apiRequest)
        ↓
Backend
```

Run `npm run architecture:check` to enforce these rules. It is also part of
`npm run verify` and therefore the `Quality` CI job.

Navigation conventions and the current route contract are documented in
`docs/navigation.md`.

## State ownership

- **Server State**: Managed exclusively through TanStack Query v5 (`@tanstack/react-query`).
  Query and mutation hooks live in `<feature>/hooks/` and return clean UI contracts.
  Query keys are private inside the feature.
- **Client State**: Local component state (`useState`, `useReducer`) for UI state.
- **Credential Storage**: Access and refresh tokens are stored in `react-native-keychain`
  behind the `tokenManager` abstraction. Credentials must never be stored in Redux
  or TanStack Query cache.

## Import aliases

Use these aliases when crossing a layer boundary:

- `@jujistu/ui` for the public design-system API
- `@jujistu/app/*`
- `@jujistu/features/*`
- `@jujistu/shared/*`

Relative imports are appropriate inside one small module. Alias resolution is kept
in sync across TypeScript, Metro, and Jest. When an alias changes, update all three
configurations in the same pull request.

`src/ui/index.ts` is the supported UI entry point for application and feature
consumers. It exposes category barrels for atoms, molecules, organisms, and
templates. Internal registries and component recipes remain private to `src/ui`.

## Feature growth

A feature starts with a public `index.ts` and only the folders needed by its current
code. Use `screens/` for feature entry screens, `sections/` for substantial regions
of one screen, `data/` for feature-owned static content or adapters, and `hooks/` for
feature behavior. Do not use `components/` as a generic catch-all, and do not add
domain, application, repository, or service layers before they have a real role.

Shared code is promoted only after genuine reuse. Reusable visual components belong
to `ui`; non-visual infrastructure, services, configuration, and design tokens
belong to `shared`. Code used by one feature remains owned by that feature even when
it might become reusable later.

## Styling and design tokens

The project uses **NativeWind v4** and **Tailwind CSS v3** as its styling foundation:

- Directives live in `global.css` at the project root.
- Metro processes CSS via `withNativeWind` in `metro.config.js`.
- Design tokens and extended palette are configured in `tailwind.config.js`.
- UI components apply layout, spacing, and typography using utility `className` strings.
- See `docs/adr/0003-nativewind-styling-foundation.md` for architectural context.
