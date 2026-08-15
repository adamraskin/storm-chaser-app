const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite's web implementation loads a .wasm file that Metro
// doesn't treat as an asset by default.
config.resolver.assetExts.push('wasm');

module.exports = config;
