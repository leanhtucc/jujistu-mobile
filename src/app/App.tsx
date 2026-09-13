import { useAppTheme } from '@jujistu/shared/theme/useAppTheme';
import { StatusBar } from 'react-native';

import { bootstrapApp } from './bootstrap/bootstrapApp';
import { RootNavigator } from './navigation/RootNavigator';
import { AppProviders } from './providers/AppProviders';

bootstrapApp();

function AppContent() {
  const theme = useAppTheme();

  return (
    <>
      <StatusBar barStyle={theme.statusBarStyle} />
      <RootNavigator />
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
