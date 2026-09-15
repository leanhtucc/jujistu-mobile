import { NewAppScreen } from '@react-native/new-app-screen';
import { useAppTheme } from '@jujistu/shared/theme/useAppTheme';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useAppTheme();

  return (
    <View
      className="flex-1 bg-white dark:bg-black"
      style={{ backgroundColor: theme.colors.background }}
    >
      <NewAppScreen
        templateFileName="src/features/home/presentation/HomeScreen.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}
