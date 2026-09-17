import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '../atoms/icon';

export type ToastStatus =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'information'
  | 'error';

export type ToastStyleVariant = 'style1' | 'style2' | 'inline' | 'push';

export interface ToastProps {
  message: string;
  title?: string;
  status?: ToastStatus;
  styleVariant?: ToastStyleVariant;
  visible?: boolean;
  icon?: IconName;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
