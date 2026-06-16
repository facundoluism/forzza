// metro.config.js — Forzza Mobile
// Necesario para que Metro funcione correctamente en un monorepo pnpm con Expo SDK 54.
// Sin este archivo, Metro usa su configuración por defecto que solo observa apps/mobile
// y, con el layout de symlinks de pnpm, termina cargando DOS instancias de react
// (una resuelta desde apps/mobile y otra desde packages/ui), produciendo
// "Invalid hook call" por ReactCurrentDispatcher duplicado.

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// projectRoot: directorio de esta app.
// monorepoRoot: raíz del workspace pnpm (dos niveles arriba).
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// watchFolders: observar solo los paquetes workspace que importa mobile.
// Evita que Metro camine node_modules/android builds completos en Windows.
config.watchFolders = [
  path.resolve(monorepoRoot, 'packages/config'),
  path.resolve(monorepoRoot, 'packages/core'),
  path.resolve(monorepoRoot, 'packages/db-types'),
  path.resolve(monorepoRoot, 'packages/ui'),
];

// nodeModulesPaths: orden de búsqueda de node_modules.
// Primero node_modules LOCAL de la app, luego los de la raíz del monorepo.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

config.resolver.blockList = [
  /.*[/\\]android[/\\]app[/\\]build[/\\].*/,
  /.*[/\\]android[/\\]build[/\\].*/,
];

// IMPORTANTE: NO usamos disableHierarchicalLookup en pnpm.
// pnpm guarda las deps transitivas dentro del node_modules anidado de cada paquete
// (ej: .pnpm/expo-router@.../node_modules/@expo/metro-runtime). Si desactivamos la
// búsqueda jerárquica, Metro no encuentra esas deps y falla con "Unable to resolve".
// En su lugar, deduplicamos SOLO react (la causa del invalid hook call) con resolveRequest.

// Forzar una instancia ÚNICA de react: cualquier import de 'react' desde cualquier
// paquete del workspace resuelve siempre al mismo archivo físico en
// apps/mobile/node_modules/react (que pnpm ya deduplicó a react@19.1.0).
// Esto elimina el ReactCurrentDispatcher duplicado SIN romper la resolución de
// las demás dependencias transitivas de pnpm.
const reactSingletons = {
  react: require.resolve('react', { paths: [projectRoot] }),
  'react/jsx-runtime': require.resolve('react/jsx-runtime', { paths: [projectRoot] }),
  'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime', { paths: [projectRoot] }),
};

const defaultResolveRequest = config.resolver.resolveRequest;
const resolveWithDefault = (context, moduleName, platform) =>
  defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const forced = reactSingletons[moduleName];
  if (forced) {
    return { type: 'sourceFile', filePath: forced };
  }

  try {
    return resolveWithDefault(context, moduleName, platform);
  } catch (error) {
    if (moduleName.endsWith('.js')) {
      return resolveWithDefault(context, moduleName.slice(0, -3), platform);
    }
    throw error;
  }
};

// Nota: unstable_enableSymlinks está activado por defecto en SDK 54.
// NO lo desactivamos — es lo que permite a Metro atravesar los symlinks de pnpm
// y encontrar packages/ui/src/native desde apps/mobile.

module.exports = config;
