#!/usr/bin/env node
// db:types — regenera packages/db-types desde el esquema de Supabase
const { execSync } = require("child_process");
const path = require("path");

const outputFile = path.join(__dirname, "..", "packages", "db-types", "src", "index.ts");

try {
  console.log("Regenerando tipos de Supabase...");
  execSync(
    `supabase gen types typescript --local > "${outputFile}"`,
    { stdio: ["pipe", "pipe", "inherit"] }
  );
  console.log("Tipos generados en packages/db-types/src/index.ts");
} catch (err) {
  console.error("Error al generar tipos:", err.message);
  process.exit(1);
}
