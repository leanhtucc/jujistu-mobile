# Environment configuration

JUJISTU supports three build environments:

- `development`
- `staging`
- `production`

The environment is selected when Metro starts or creates a JavaScript bundle. The
scripts in `package.json` set `JUJISTU_ENV` consistently on Windows, macOS, and
Linux. Stop a running Metro process before switching environments.

## Commands

| Environment | Metro                      | Android                      | iOS                      |
| ----------- | -------------------------- | ---------------------------- | ------------------------ |
| Development | `npm start`                | `npm run android`            | `npm run ios`            |
| Staging     | `npm run start:staging`    | `npm run android:staging`    | `npm run ios:staging`    |
| Production  | `npm run start:production` | `npm run android:production` | `npm run ios:production` |

The environment name and native build configuration are separate concerns. For
example, `android:production` selects production application configuration but does
not automatically create or sign a release build.

## Public values and secrets

Typed public configuration lives in
`src/shared/config/appConfig.ts`. API URLs are deliberately `null` until backend
ownership and URLs are agreed. Add public URLs there in a focused pull request.

Anything bundled into a mobile application can be extracted by an end user. Never
place passwords, private API keys, signing credentials, service-account keys,
access tokens, or refresh tokens in this configuration or in an `.env` file.
Runtime user credentials must later use Keychain/Keystore-backed secure storage.

## Validation

Application bootstrap validates the environment before rendering. Configuration
also enforces:

- only the three supported environment names;
- HTTPS API URLs for staging and production;
- HTTP only for known local development hosts; and
- normalized API URLs without a trailing slash.

The Babel plugin only replaces the allowlisted `process.env.JUJISTU_ENV` reference.
It does not expose the machine's other environment variables to JavaScript.

## Native identifiers

All environments currently retain the approved identifiers:

- Android: `com.jujistu.app`
- iOS: `com.jujistu.app`

Do not add application ID suffixes, schemes, targets, or separate signing setups
until the team explicitly decides whether independently installable staging and
production applications are required. That change needs its own ADR.
