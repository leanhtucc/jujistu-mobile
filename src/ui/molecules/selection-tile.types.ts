import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '../atoms/icon';

export type SelectionTileState =
  | 'default'
  | 'focus'
  | 'selected'
  | 'success'
  | 'error'
  | 'warning'
  | 'disabled';

export type SelectionTileTitleWeight = 'medium' | 'semibold';

export interface SelectionTileProps {
  title: string;
  description?: string;
  badge?: string;
  info?: string;
  checked?: boolean;
  selected?: boolean;
  state?: SelectionTileState;
  titleWeight?: SelectionTileTitleWeight;
  icon?: IconName;
  image?: ImageSourcePropType;
  showTrailingIcon?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
