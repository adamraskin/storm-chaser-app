import { registerRootComponent } from 'expo';

import App from './App';

// Wraps AppRegistry.registerComponent so the app boots the same in Expo Go and native builds.
registerRootComponent(App);
