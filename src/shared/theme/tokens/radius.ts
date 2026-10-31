export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 16,
  card: 14,
  banner: 20,
  sheet: 28,
  full: 999,
} as const;

export type Radius = typeof radius;
