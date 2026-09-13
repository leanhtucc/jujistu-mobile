import { HomeScreen } from '@jujistu/features/home';
import { useAppTheme } from '@jujistu/shared/theme/useAppTheme';
import { StatusBar } from 'react-native';

import { AppProviders } from './providers/AppProviders';

function AppContent() {
  const theme = useAppTheme();

  return (
    <>
      <StatusBar barStyle={theme.statusBarStyle} />
      <HomeScreen />
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
