import type { PropsWithChildren } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type TooltipDirection = 'top' | 'right' | 'bottom' | 'left';
export type TooltipStyle = 'solid' | 'soft';

export interface TooltipProps extends PropsWithChildren {
  text?: string;
  direction?: TooltipDirection;
  styleVariant?: TooltipStyle;
  visible?: boolean;
  numberOfLines?: number;
  bubbleStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
