module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": ".",
          },
        },
      ],
      // Reanimated 4: el plugin de worklets DEBE ir SIEMPRE el último de la lista.
      // (En v4 el plugin se movió de `react-native-reanimated/plugin` a
      // `react-native-worklets/plugin`.)
      "react-native-worklets/plugin",
    ],
  };
};
