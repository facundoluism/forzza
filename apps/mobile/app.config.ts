import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Forzza',
  slug: 'forzza',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'forzza',
  userInterfaceStyle: 'dark',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.forzza.app',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'Forzza usa la cámara para tomar fotos de progreso corporal.',
      NSPhotoLibraryUsageDescription: 'Forzza accede a tus fotos para subir fotos de progreso.',
      NSPhotoLibraryAddUsageDescription: 'Forzza guarda fotos de progreso en tu galería.',
    },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0A0A0A',
    },
  },
  android: {
    package: 'com.forzza.app',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0A0A0A',
    },
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_MEDIA_IMAGES',
    ],
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0A0A0A',
    },
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-notifications',
      {
        icon: './assets/icon.png',
        color: '#C8FF00',
        defaultChannel: 'default',
      },
    ],
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        project: 'forzza-mobile',
      },
    ],
    [
      'expo-build-properties',
      {
        ios: { deploymentTarget: '16.4' },
        android: { compileSdkVersion: 35, targetSdkVersion: 35, buildToolsVersion: '35.0.0' },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? 'PLACEHOLDER_SET_IN_EAS',
    },
  },
  owner: 'forzza',
})
