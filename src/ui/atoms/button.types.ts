import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

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
  /**
   * Ends the primary button with a dark rank-bar segment (two stripes and an
   * arrow), like the tip of a belt. Applies to the filled primary button only.
   */
  beltTip?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}
