import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from './icon';

export type ButtonVariant = 'primary' | 'secondaryDark' | 'secondaryLight';

export type ButtonSize = 'md' | 'sm';

export type ButtonIconPosition = 'leading' | 'trailing';

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: ButtonIconPosition;
  disabled?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
}
