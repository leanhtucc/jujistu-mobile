# ADR 0017: Redesign Home Screen to v4 Jujitsu Tournament Platform

- Status: Accepted
- Date: 2026-10-10
- Supersedes: ADR 0011, ADR 0012 (visual header and section composition)

## Context

The initial Home screen implementation was based on an early gaming/RPG prototype with levels, experience bars, dual currencies (gems and coins), and placeholder MMA academy actions.

The canonical product design has been updated in `Jujitsu App v4 - offline.html` to reflect the Jujitsu Vietnam tournament, media, athlete, and merchandise ecosystem.

## Decision

1. **Header Architecture**:

   - Replace the legacy `ProductAccountHeader` (which displayed user level and gem balance) with `HomeHeader`.
   - `HomeHeader` displays the primary brand identity (`JUJITSU VIỆT NAM`), a live broadcast badge (`TRỰC TIẾP`), coin balance chip (`12.500`), and a notification center button.
   - For unauthenticated users (`guest` mode), continue rendering `GuestAccountHeader` at the top of the Home screen to provide clear onboarding and login call-to-actions.

2. **Carousel & Hero Visuals**:

   - Update `HomeHeroCarousel` to showcase tournament highlights:
     - Slide 1: Live finals (Chung kết Newaza NoGi)
     - Slide 2: Main face-off (Đức Anh vs Minh Khoa)
     - Slide 3: Equipment showcase (Võ phục thi đấu Pro 450)
   - Retain accessibility semantics (`Banner sự kiện nổi bật`) and startup readiness signaling (`onInitialImageSettled`).

3. **Consolidated Quick Actions**:

   - Standardize the 4 primary quick action shortcuts:
     1. Lịch giải (Tournaments)
     2. Kết quả (Results / Brackets)
     3. Đặt vé (Ticketing)
     4. Video (Media library)

4. **Tournament & Sport Ecosystem Sections**:

   - Introduce `HomeMatchCard`: Spotlight match card with live countdown timer, fighter face-off, and YouTube streaming trigger.
   - Introduce `HomeTournamentSection`: Major tournament card (Giải Vô địch Quốc gia 2026 Đà Nẵng) with registration metrics and CTA.
   - Introduce `HomeProductsSection`: Curated merchandise carousel (Gi Thi đấu Pro 450, Rashguard Compression).
   - Retain and refresh `HomeFeaturedVideoSection` and `HomeNewsSection` with BJJ tournament data.

5. **Test Alignment**:
   - Update Home screen and feed tests to assert against the v4 tournament product specifications rather than obsolete prototype strings.

## Consequences

- The Home screen matches the verified v4 HTML specification.
- Architecture boundaries (`app -> features -> ui -> shared`) remain strictly preserved.
- Existing startup coordination (ADR 0009) and responsive layouts (ADR 0010) are maintained.
