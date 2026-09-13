# Source architecture

JUJISTU uses feature-based modules with lightweight dependency boundaries. Create
folders only when code has a current responsibility; an empty directory is not
architecture.

## Layers

```text
src/
├── app/                 application composition and providers
├── features/            user-facing capabilities grouped by feature
│   └── home/
│       ├── index.ts     public API
│       └── presentation/
└── shared/              reusable, product-agnostic infrastructure and UI
    ├── config/
    └── theme/
```

The allowed dependency direction is:

```text
app ──────> features ──────> shared
 └────────────────────────> shared
```

- `app` may compose features and shared infrastructure.
- A feature may import its own files and `shared`.
- A feature must not import `app` or another feature.
- `shared` must not import `app` or any feature.
- `app` imports a feature through that feature's `index.ts` public API.
- Screen components do not call `fetch` or a shared API client directly.

Run `npm run architecture:check` to enforce these rules. It is also part of
`npm run verify` and therefore the `Quality` CI job.

## Import aliases

Use these aliases when crossing a layer boundary:

- `@jujistu/app/*`
- `@jujistu/features/*`
- `@jujistu/shared/*`

Relative imports are appropriate inside one small module. Alias resolution is kept
in sync across TypeScript, Metro, and Jest. When an alias changes, update all three
configurations in the same pull request.

## Feature growth

A feature starts with a public `index.ts` and only the folder needed by its current
code. Add `domain`, `data`, or `application` folders later when real business rules,
data adapters, or use cases exist. Do not add generic repositories, services, or
base classes in anticipation of future requirements.

Shared code is promoted only after genuine reuse. Code used by one feature remains
owned by that feature even when it might become reusable later.
