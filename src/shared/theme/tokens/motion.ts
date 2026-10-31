/**
 * Motion tokens from the Jujitsu Mobile design system.
 * Easing curves are cubic-bezier control points: [x1, y1, x2, y2].
 */
export const motionDuration = {
  fast: 120,
  base: 180,
  slow: 260,
  sweep: 420,
} as const;

export const motionEasing = {
  /** Snaps in and settles: sheets, toggles, press release. */
  grip: [0.2, 0.9, 0.1, 1],
  /** Dismissals. */
  release: [0.4, 0, 0.2, 1],
  /** Progress and belt fills. */
  sweep: [0.65, 0, 0.35, 1],
  /** Overshoot: only press-release, stamps and stripe pops. */
  spring: [0.34, 1.56, 0.64, 1],
} as const;

export type MotionDuration = typeof motionDuration;
export type MotionEasing = typeof motionEasing;
