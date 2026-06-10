#!/usr/bin/env node
// test:rls — corre los tests de RLS de Supabase
const { execSync } = require("child_process");

try {
  console.log("Corriendo tests de RLS...");
  execSync("supabase test db", { stdio: "inherit" });
  console.log("Tests de RLS pasaron");
} catch (err) {
  console.error("Tests de RLS fallaron");
  process.exit(1);
}
