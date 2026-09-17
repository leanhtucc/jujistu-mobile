import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '../atoms/icon';

export type AnswerOptionSize = 'medium' | 'large';

export type AnswerOptionState =
  | 'default'
  | 'focus'
  | 'selected'
  | 'success'
  | 'error'
  | 'warning'
  | 'disabled';

export interface AnswerOptionProps {
  label: string;
  onPress?: () => void;
  size?: AnswerOptionSize;
  state?: AnswerOptionState;
  selected?: boolean;
  disabled?: boolean;
  icon?: IconName;
  imageSource?: ImageSourcePropType;
  imageAccessibilityLabel?: string;
  alignText?: 'left' | 'center';
  numberOfLines?: number;
  opacity?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
