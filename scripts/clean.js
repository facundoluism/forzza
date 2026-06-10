#!/usr/bin/env node
// Limpieza de artefactos de build (cross-platform, sin rm -rf)
const { execSync } = require("child_process");

const patterns = [
  "apps/web/.next",
  "apps/web/dist",
  "apps/mobile/dist",
  "packages/*/dist",
  "coverage",
];

for (const pattern of patterns) {
  try {
    execSync(`node -e "require('rimraf').sync('${pattern}')"`, { stdio: "pipe" });
    console.log(`Limpiado: ${pattern}`);
  } catch (_) {
    // Silencioso si no existe
  }
}
console.log("Limpieza completada");
