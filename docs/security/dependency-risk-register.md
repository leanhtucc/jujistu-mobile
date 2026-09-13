# Dependency risk register

Last reviewed: 2026-09-13

## Open advisories

### React Native 0.87 / Metro toolchain

`npm audit --omit=dev` reports high-severity denial-of-service advisories in the
React Native 0.87.1 Metro dependency tree. npm currently suggests downgrading core
packages to 0.86.3, which is not a compatible patch and would violate the accepted
project baseline.

Decision: do not use `npm audit fix --force` or downgrade individual React Native
packages. Track an upstream 0.87 patch and upgrade the complete matching React
Native package set together after native validation.

### React Navigation URL parsing

React Navigation 7.3.18 currently resolves `query-string` 7.1.3, which depends on a
version of `decode-uri-component` affected by GHSA-vcc3-ghjq-m6fr. npm reports no
compatible fix for the latest stable React Navigation 7 release.

Current exposure is limited because JUJISTU does not enable external deep linking
or parse untrusted URLs into navigation state.

Decision:

- do not enable deep linking until the advisory is fixed or a focused threat review
  accepts a mitigation;
- do not switch the production base to React Navigation 8 alpha solely to silence
  the audit;
- review this entry whenever React Navigation is upgraded; and
- treat any external URL-navigation feature as security-sensitive.

## Review process

Run `npm audit --omit=dev` for dependency pull requests. Audit output is evidence,
not an instruction to apply breaking upgrades automatically. Document unresolved
runtime advisories here with exposure, mitigation, owner, and review trigger.
