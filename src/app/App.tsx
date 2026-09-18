import { StatusBar } from 'react-native';

import { bootstrapApp } from './bootstrap/bootstrapApp';
import { RootNavigator } from './navigation/RootNavigator';
import { AppProviders } from './providers/AppProviders';

bootstrapApp();

function AppContent() {
  return (
    <>
      <StatusBar barStyle="light-content" hidden={false} />
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
