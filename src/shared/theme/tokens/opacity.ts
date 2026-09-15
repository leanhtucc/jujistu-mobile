export const opacity = {
  0: 0,
  disabled: 0.5,
  overlay: 0.8,
  full: 1,
} as const;

export type Opacity = typeof opacity;
