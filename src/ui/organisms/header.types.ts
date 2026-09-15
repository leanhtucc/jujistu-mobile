import type { IconName } from '../atoms/icon';

export type HeaderBackground = 'solid' | 'transparent';

export interface HeaderAction {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
}

export interface HeaderProps {
  title: string;

  onBackPress: () => void;
  backAccessibilityLabel: string;

  background?: HeaderBackground;

  trailingAction?: HeaderAction;
}
