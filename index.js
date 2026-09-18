/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';

LogBox.ignoreLogs(['ImageBackground is deprecated']);

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
