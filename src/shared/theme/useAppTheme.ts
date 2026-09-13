import { useColorScheme } from 'react-native';

import { darkColors, lightColors } from './colors';

export function useAppTheme() {
  const isDark = useColorScheme() === 'dark';

  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
    statusBarStyle: isDark ? 'light-content' : 'dark-content',
  } as const;
}
