import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from './icon';

export type ButtonVariant = 'primary' | 'secondaryDark' | 'secondaryLight';

export type ButtonAppearance = 'filled' | 'outline' | 'ghost' | 'soft';

export type ButtonSize = 'lg' | 'md' | 'sm';

export type ButtonIconPosition = 'leading' | 'trailing';

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: ButtonIconPosition;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
}
