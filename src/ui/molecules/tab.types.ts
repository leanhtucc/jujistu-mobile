import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { IconName } from '../atoms/icon';

export type TabSize = 'sm' | 'md' | 'lg';
export type TabAppearance = 'filled' | 'soft';
export type TabVariant = 'primary' | 'neutral';

export interface TabProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  size?: TabSize;
  appearance?: TabAppearance;
  variant?: TabVariant;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}
