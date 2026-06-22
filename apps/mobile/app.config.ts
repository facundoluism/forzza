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
    // ─── iOS Privacy Manifest (P0.4) ────────────────────────────────────────
    // Requerido por App Store desde mayo 2024 para toda app nueva.
    // Expo SDK 50+ inyecta este objeto en el PrivacyInfo.xcprivacy durante el
    // build CNG/EAS; no hace falta crear el archivo .xcprivacy manualmente.
    // IMPORTANTE: cada SDK también incluye su propio PrivacyInfo (expo-constants,
    // expo-file-system, react-native core, etc.). Apple debería agregarlos
    // automáticamente para los frameworks dinámicos, pero su parser falla con
    // dependencias estáticas (CocoaPods). Por eso el manifest de la APP actúa
    // como agregador conservador: declara la unión de todos los API types usados
    // por cualquier SDK transitivo del proyecto.
    privacyManifests: {
      // ── Tracking ─────────────────────────────────────────────────────────
      // Forzza NO hace cross-app tracking para publicidad.
      // PostHog se usa como analytics de producto con scrubPII() que elimina
      // email, nombre, birth_date, cbu, tokens antes de cada envío. Los eventos
      // son segmentados por plan/role/country_code con coach_id hasheado —
      // ninguno de ellos cruza la barrera app-to-app para propósitos
      // publicitarios. Por tanto NSPrivacyTracking = false y dominios vacíos.
      // HUMAN_REQUIRED: si en el futuro se activa publicidad basada en
      // identidad cross-app (p.ej. Meta Pixel, SKAdNetwork con fingerprinting),
      // cambiar a true y agregar los dominios correspondientes.
      NSPrivacyTracking: false,
      NSPrivacyTrackingDomains: [],

      // ── Datos recolectados ────────────────────────────────────────────────
      // Mapeados desde docs/compliance/data-map.md.
      // Insumo directo de la Apple Privacy Nutrition Label (P0.5).
      // Para cada tipo: linked = vinculado a identidad del usuario en nuestros
      // servidores; tracking = false en todos (no advertising tracking).
      NSPrivacyCollectedDataTypes: [
        // 1. Email — auth.users.email, leads.email
        //    Login, notificaciones transaccionales, marketing opt-in (leads).
        //    Vinculado a cuenta → linked: true.
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeEmailAddress',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
          ],
        },

        // 2. Identificador de usuario — users.id (UUID interno)
        //    PK interna usada en joins, analytics y RLS. Vinculado.
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeUserID',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
            'NSPrivacyCollectedDataTypePurposeAnalytics',
          ],
        },

        // 3. Datos de salud y fitness — SENSIBLE
        //    body_metrics (peso, talla, % grasa), workout_sessions.sets_data,
        //    checkin_responses.answers, student_profiles.goals/level.
        //    Vinculado al perfil del alumno. Base legal: consentimiento expreso.
        //    HUMAN_REQUIRED: verificar en App Store Connect que se seleccione
        //    "Health & Fitness" y se marque como "sensitive" en el cuestionario
        //    de la Nutrition Label (P0.5).
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeHealth',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
          ],
        },
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeFitness',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
          ],
        },

        // 4. Fotos — bucket progress-photos (fotos corporales del alumno)
        //    y coach-avatars (imagen de perfil del coach, pública).
        //    Vinculado al perfil. Sensible para progress-photos (cuerpo).
        //    HUMAN_REQUIRED: marcar "Photos or Videos" como "sensitive" en
        //    App Store Connect porque las fotos de progreso son imágenes
        //    corporales del usuario.
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePhotosorVideos',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
          ],
        },

        // 5. Historial de compras — subscriptions (plan, período),
        //    payments (monto, estado), RevenueCat (gateway_subscription_id).
        //    Vinculado al usuario. Usado para funcionalidad de gating PRO.
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePurchaseHistory',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
          ],
        },

        // 6. Datos de crash / diagnóstico — Sentry (stack traces, contexto de
        //    error). PII eliminada por beforeSend(). IP anonimizada a {{auto}}.
        //    No vinculado a identidad (Sentry no recibe email ni user ID real).
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeCrashData',
          NSPrivacyCollectedDataTypeLinked: false,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
          ],
        },

        // 7. Interacción con el producto — PostHog (signup_completed, login,
        //    workout_started/completed, tabata_*, coach_profile_viewed, etc.).
        //    scrubPII() elimina 16 keys con PII antes del envío.
        //    Segmentado por plan/role/country_code/coach_id-hashed.
        //    No vinculado a identidad nominal (no se envía email).
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeProductInteraction',
          NSPrivacyCollectedDataTypeLinked: false,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAnalytics',
          ],
        },

        // 8. Datos de rendimiento — PostHog (performance/funnel analytics).
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePerformanceData',
          NSPrivacyCollectedDataTypeLinked: false,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAnalytics',
          ],
        },

        // 9. Otros datos de diagnóstico — Sentry performance monitoring.
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeOtherDiagnosticData',
          NSPrivacyCollectedDataTypeLinked: false,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
          ],
        },
      ],

      // ── Required Reason APIs ──────────────────────────────────────────────
      // El manifest de la app agrega los API types de todos los SDKs
      // transitivos, porque Apple no siempre parsea los manifests de
      // frameworks estáticos enlazados vía CocoaPods.
      // Fuentes verificadas en node_modules:
      //   • expo-constants/ios/PrivacyInfo.xcprivacy       → UserDefaults CA92.1
      //   • expo-localization/ios/PrivacyInfo.xcprivacy    → UserDefaults CA92.1
      //   • expo-notifications/ios/PrivacyInfo.xcprivacy   → UserDefaults CA92.1
      //   • react-native React/Resources/PrivacyInfo        → UserDefaults CA92.1
      //   • expo-application/ios/PrivacyInfo.xcprivacy     → FileTimestamp C617.1
      //   • @rn-async-storage/ios/PrivacyInfo.xcprivacy    → FileTimestamp C617.1
      //   • react-native React/Resources/PrivacyInfo        → FileTimestamp C617.1
      //   • expo-file-system/ios/PrivacyInfo.xcprivacy     → FileTimestamp 0A2A.1, 3B52.1
      //   • expo-file-system/ios/PrivacyInfo.xcprivacy     → DiskSpace E174.1, 85F4.1
      //   • @sentry/react-native (sin PrivacyInfo en npm)  → UserDefaults CA92.1,
      //                                                       SystemBootTime 35F9.1,
      //                                                       FileTimestamp C617.1
      //     (razones documentadas en docs.sentry.io/platforms/react-native)
      // RevenueCat (react-native-purchases): su PrivacyInfo viene como
      //   CocoaPod nativo; EAS debería mergearlo. Se incluye 35F9.1 como
      //   precaución (RevenueCat usa timestamps de sesión).
      //   HUMAN_REQUIRED: tras primer build EAS, abrir Xcode → Target →
      //   Privacy Manifest y verificar que no aparezcan warnings de "missing
      //   reason" para PurchasesHybridCommon o Purchases pods.
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          // CA92.1: acceso a UserDefaults para guardar preferencias de la app
          //         (expo-constants, expo-notifications, expo-localization,
          //          react-native core, @sentry/react-native).
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          // C617.1: acceso a timestamps de archivos del propio bundle de la app
          //         (async-storage, expo-application, react-native, sentry).
          // 0A2A.1: mostrar timestamps de archivos al usuario (expo-file-system).
          // 3B52.1: acceso a timestamps de archivos creados por la app
          //         (expo-file-system para caché de recursos).
          NSPrivacyAccessedAPITypeReasons: ['C617.1', '0A2A.1', '3B52.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategorySystemBootTime',
          // 35F9.1: calcular tiempo transcurrido desde el arranque para
          //         medición de duración de sesiones de error (Sentry).
          NSPrivacyAccessedAPITypeReasons: ['35F9.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryDiskSpace',
          // E174.1: comprobar espacio disponible antes de escribir archivos
          //         (expo-file-system para caché y uploads de fotos).
          // 85F4.1: presentar al usuario info de espacio disponible
          //         (expo-file-system).
          NSPrivacyAccessedAPITypeReasons: ['E174.1', '85F4.1'],
        },
      ],
    },
    // ────────────────────────────────────────────────────────────────────────
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
    'expo-localization',
    'expo-secure-store',
    // La app no graba audio: el Tabata solo reproduce pitidos y image-picker solo
    // selecciona imágenes (nunca video). Desactivamos el permiso de micrófono en ambos
    // módulos con sus opciones oficiales para no pedir RECORD_AUDIO (Android) ni
    // NSMicrophoneUsageDescription (iOS).
    ['expo-audio', { microphonePermission: false, recordAudioAndroid: false }],
    ['expo-image-picker', { microphonePermission: false }],
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
