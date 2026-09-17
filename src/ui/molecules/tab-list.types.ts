import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '../atoms/icon';
import type { TabAppearance, TabSize, TabVariant } from './tab.types';

export interface TabListItem<Key extends string = string> {
  key: Key;
  label: string;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export interface TabListProps<Key extends string = string> {
  items: Array<TabListItem<Key>>;
  activeKey: Key;
  onTabPress: (key: Key) => void;
  size?: TabSize;
  appearance?: TabAppearance;
  variant?: TabVariant;
  scrollable?: boolean;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  testID?: string;
}
