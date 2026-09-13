# GitHub repository protection

Apply these settings after the repository has been pushed to GitHub and the CI
workflow has completed at least once. Status checks only appear in the repository
settings after their first run.

## Protect `main`

Create a branch protection rule or repository ruleset targeting `main` with:

- pull requests required before merging;
- at least one approving review;
- stale approvals dismissed when new commits are pushed;
- approval of the most recent reviewable push required;
- all review conversations resolved;
- branches required to be up to date before merging;
- these exact required status checks:
  - `Quality`
  - `Android debug build`
  - `iOS simulator build`
- force pushes and branch deletion blocked;
- linear history required; and
- the rule applied to administrators as well as contributors.

Use squash merge by default and delete merged branches. Do not enable merge queue
until the workflow also handles the `merge_group` event.

## Ownership

Add `.github/CODEOWNERS` only after the real GitHub users or teams are known. At a
minimum, ownership should cover:

- `android/` and `ios/`: mobile/native maintainers;
- `.github/workflows/`: repository maintainers;
- `docs/adr/`: technical leads; and
- dependency manifests and lockfiles: mobile maintainers.

Do not commit placeholder owners: invalid owners create a false sense that review
is enforced.

## Repository settings

- Allow GitHub Actions from GitHub and verified creators only, unless another
  action is reviewed and explicitly approved.
- Keep workflow token permissions read-only by default.
- Require approval before workflows from first-time external contributors run.
- Enable secret scanning, push protection, and dependency alerts when available.
- Prevent collaborators from bypassing rules except for a documented emergency.

Review the rule whenever a workflow job is renamed because required checks are
matched by their displayed names.
