# ADR 0009: Coordinate startup by readiness signals

- Status: Accepted
- Date: 2026-09-18

## Context

The native launch screen, JavaScript loading screen, session restoration, and first
navigation destination previously behaved as separate lifecycles. Authentication
restoration also included a fixed delay. This allowed the loading screen to be
removed before the destination background and navigation tree had produced their
first usable frame, causing black, white, or partially rendered frames.

## Decision

The root navigator is the startup coordinator. It keeps the app loading scene as an
opaque overlay until all of these signals are true:

1. secure session storage and the optional current-user query have resolved;
2. the loading scene has laid out and its local background and logo have settled;
3. the navigation container is ready;
4. the selected destination has laid out and its critical local background has
   settled; and
5. the minimum visible presentation duration (4000ms) has elapsed from the
   moment the loading scene became visible.

Only then does the overlay perform a short visual fade and unmount. That fade is a
transition, not an initialization delay. Image failures are logged and count as a
settled state so that the app can continue over its black fallback.

The 4000ms duration is a UX presentation requirement so that users can view the
brand identity and loading scene fully. The timer and the determinate progress bar
(animating smoothly from 0% to 100%) begin only after the loading scene is fully
visible. It does not introduce artificial delays to auth, storage, or network
initialization. Fixed delays inside auth hooks remain strictly forbidden.

Native launch themes, the React root, navigation surfaces, and authentication
backgrounds use black fallbacks independent of the device light/dark preference.
The authentication background wraps the whole auth navigator so it persists across
Welcome, Login, and OTP routes. Auth content remains mounted and usable if its image
cannot load.

## Consequences

- Loading duration follows real device, storage, query, layout, and asset work.
- The first destination is allowed to mount behind the loading overlay, but Login is
  not pre-mounted; therefore its focused input cannot open the keyboard during
  startup.
- Development builds can still show Metro bundle-loading UI before JavaScript runs.
  That phase is owned by React Native tooling and is not the app loading screen.
- Local raster assets must retain black fallbacks. Asset density correctness is a
  separate visual-quality concern and must not be hidden with arbitrary delays.
