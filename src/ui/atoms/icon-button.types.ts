import type { StyleProp, ViewStyle } from 'react-native';

import type { ButtonAppearance, ButtonVariant } from './button.types';
import type { IconName } from './icon';

export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
  size?: IconButtonSize;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  disabled?: boolean;
  loading?: boolean;
  /** `pill` rounds the button fully, as the design system's icon buttons. */
  shape?: 'square' | 'pill';
  containerStyle?: StyleProp<ViewStyle>;
}
