// Config plugin: remueve android.permission.RECORD_AUDIO del manifest final.
//
// expo-audio declara RECORD_AUDIO desde su módulo nativo, pero el Tabata (y la
// app en general) SOLO reproduce audio, nunca graba. Pedir micrófono sin usarlo
// genera fricción en la review de Google Play. Marcamos el permiso con
// tools:node="remove" para que el Manifest Merger de Gradle lo elimine del .aab.
//
// Verificación: tras `expo prebuild` + `gradlew :app:processDebugManifest`, el
// AndroidManifest.xml mergeado NO debe contener RECORD_AUDIO.
const { withAndroidManifest } = require("@expo/config-plugins");

const RECORD_AUDIO = "android.permission.RECORD_AUDIO";
const TOOLS_NS = "http://schemas.android.com/tools";

module.exports = function withRemoveRecordAudio(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;

    // Asegurar el namespace `tools` en el <manifest> root.
    manifest.$ = manifest.$ || {};
    if (!manifest.$["xmlns:tools"]) {
      manifest.$["xmlns:tools"] = TOOLS_NS;
    }

    const permissions = Array.isArray(manifest["uses-permission"])
      ? manifest["uses-permission"]
      : [];

    // Sacar cualquier RECORD_AUDIO previo (declarado por la app) y dejar uno solo
    // con tools:node="remove" para que el merger lo elimine del manifest final.
    const filtered = permissions.filter(
      (p) => p?.$?.["android:name"] !== RECORD_AUDIO,
    );
    filtered.push({ $: { "android:name": RECORD_AUDIO, "tools:node": "remove" } });

    manifest["uses-permission"] = filtered;
    return cfg;
  });
};
