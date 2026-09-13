# JUJISTU Agent Instructions

Before modifying this repository, read:

1. `README.md`
2. `CONTRIBUTING.md`
3. `docs/adr/0001-project-foundation.md`
4. `docs/architecture.md`
5. any ADR relevant to the requested change

Treat those files as the canonical project rules. Do not duplicate them into
tool-specific instruction trees.

Required behavior:

- inspect existing code and native configuration before editing;
- make the smallest change that satisfies the request;
- preserve the React Native 0.87.1 native template unless a dedicated upgrade is
  explicitly requested;
- use npm only and never create another package-manager lockfile;
- do not add dependencies, change native build tools, or edit signing configuration
  without a concrete requirement;
- do not introduce empty folders or speculative layers;
- do not expose secrets or log credentials and personal data; and
- run `npm run verify` after relevant source or configuration changes.

Never claim Android or iOS validation unless the corresponding build actually ran.
Record architectural decisions in `docs/adr/` rather than only in chat or prompts.
