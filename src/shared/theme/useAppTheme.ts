import { useColorScheme } from 'react-native';

import { darkColors, lightColors } from './colors';

/** Semantic colours for the current system colour scheme, plus `isDark` and the status-bar style. */
export function useAppTheme() {
  const isDark = useColorScheme() === 'dark';

  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
    statusBarStyle: isDark ? 'light-content' : 'dark-content',
  } as const;
}
