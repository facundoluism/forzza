#!/usr/bin/env node
// db:reset — migra y seedea la base local
// Requiere Docker corriendo y Supabase CLI instalado
const { execSync } = require("child_process");

try {
  console.log("Reseteando base de datos local...");
  execSync("supabase db reset", { stdio: "inherit" });
  console.log("Base de datos reseteada y seedeada");
} catch (err) {
  console.error("Error al resetear la DB:", err.message);
  console.error("   Asegurate de que Docker esté corriendo y Supabase CLI instalado");
  process.exit(1);
}
