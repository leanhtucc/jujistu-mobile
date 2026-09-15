import { StyleSheet } from 'react-native';

export const borderWidth = {
  none: 0,
  hairline: StyleSheet.hairlineWidth,
  thin: 1,
  medium: 2,
} as const;

export type BorderWidth = typeof borderWidth;
