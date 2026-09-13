import { useAppTheme } from '@jujistu/shared/theme/useAppTheme';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function NavigationFallback() {
  const theme = useAppTheme();

  return (
    <View
      accessibilityLabel="Loading application"
      accessibilityRole="progressbar"
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ActivityIndicator color={theme.colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
