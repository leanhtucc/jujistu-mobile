import { HomeScreen } from '@jujistu/features/home';
import { useAppTheme } from '@jujistu/shared/theme/useAppTheme';
import { StatusBar } from 'react-native';

import { bootstrapApp } from './bootstrap/bootstrapApp';
import { AppProviders } from './providers/AppProviders';

bootstrapApp();

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
