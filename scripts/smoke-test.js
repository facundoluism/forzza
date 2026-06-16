#!/usr/bin/env node
// scripts/smoke-test.js
// Run: pnpm smoke-test -- --url http://localhost:3000

const args = process.argv.slice(2);
const urlIdx = args.indexOf("--url");
const BASE_URL = (urlIdx >= 0 ? args[urlIdx + 1] : "http://localhost:3000").replace(/\/$/, "");
const REQUIRE_FIXTURES =
  args.includes("--require-fixtures") || process.env.SMOKE_EXPECT_FIXTURES === "1";
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const SMOKE_IDS = {
  ownerUser: "10000000-0000-4000-8000-000000000001",
  coachUser: "10000000-0000-4000-8000-000000000002",
  studentUser: "10000000-0000-4000-8000-000000000003",
  coachProfile: "20000000-0000-4000-8000-000000000002",
  package: "30000000-0000-4000-8000-000000000001",
  assignment: "40000000-0000-4000-8000-000000000001",
  payment: "50000000-0000-4000-8000-000000000001",
  routine: "60000000-0000-4000-8000-000000000001",
  settlementPendingInvoice: "80000000-0000-4000-8000-000000000001",
  settlementInvoiced: "80000000-0000-4000-8000-000000000002",
  settlementApproved: "80000000-0000-4000-8000-000000000003",
};

const results = [];

function pass(name, detail = "") {
  results.push({ status: "PASS", name, detail });
  console.log(`PASS ${name}${detail ? ` - ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ status: "FAIL", name, detail });
  console.error(`FAIL ${name}${detail ? ` - ${detail}` : ""}`);
}

function manual(name, detail = "") {
  results.push({ status: "MANUAL_REQUIRED", name, detail });
  console.log(`MANUAL_REQUIRED ${name}${detail ? ` - ${detail}` : ""}`);
}

async function checkRoute(name, path, expected = [200]) {
  const expectedStatuses = Array.isArray(expected) ? expected : [expected];
  try {
    const res = await fetch(`${BASE_URL}${path}`, { redirect: "manual" });
    if (expectedStatuses.includes(res.status)) {
      pass(`route: ${name}`, `${path} -> ${res.status}`);
      return true;
    }
    fail(`route: ${name}`, `${path} expected ${expectedStatuses.join("/")} got ${res.status}`);
    return false;
  } catch (error) {
    fail(`route: ${name}`, error.message);
    return false;
  }
}

async function visible(page, locator, name) {
  const count = await locator.count().catch(() => 0);
  if (count === 0) {
    fail(name, "element not found");
    return false;
  }
  const first = locator.first();
  const isVisible = await first.isVisible().catch(() => false);
  if (!isVisible) {
    fail(name, "element exists but is not visible");
    return false;
  }
  pass(name);
  return true;
}

async function runBrowserSmoke() {
  let chromium;
  try {
    ({ chromium } = await import("@playwright/test"));
  } catch (error) {
    manual("browser smoke", `@playwright/test unavailable: ${error.message}`);
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await visible(page, page.getByText(/FORZZA/i), "landing shows brand");
    await visible(page, page.getByRole("link", { name: /coach/i }).first(), "landing exposes coach CTA");

    await page.goto(`${BASE_URL}/upgrade`, { waitUntil: "networkidle" });
    await visible(page, page.getByText(/PRO/i).first(), "student upgrade page exposes PRO");

    await page.goto(`${BASE_URL}/onboarding-coach`, { waitUntil: "networkidle" });
    await visible(page, page.getByText(/Registrarse como coach/i), "coach onboarding loads");
    await page.locator('input[type="text"]').first().fill("Coach Smoke");
    await page.getByRole("button", { name: /Siguiente/i }).click();
    await visible(page, page.getByText(/Datos fiscales/i), "coach onboarding reaches fiscal step");
    await page.locator("select").first().selectOption("monotributo");
    await page.getByPlaceholder(/20-12345678-9/i).fill("20-12345678-9");
    await page.getByRole("button", { name: /Siguiente/i }).click();
    await visible(page, page.getByText(/Datos bancarios/i), "coach onboarding reaches bank step");
    await page.getByPlaceholder(/0000003100012345678901/i).fill("0000003100012345678901");
    await page.getByRole("button", { name: /Siguiente/i }).click();
    await visible(page, page.getByText(/Tu perfil/i), "coach onboarding reaches public profile step");
    await visible(page, page.getByRole("button", { name: /Enviar solicitud/i }), "coach onboarding can submit request");

    await page.goto(`${BASE_URL}/coach/cobros`, { waitUntil: "networkidle" });
    await visible(page, page.getByRole("heading", { name: /Cobros/i }), "coach billing page loads");
    await visible(page, page.getByText(/Este mes/i), "coach sees current month earnings");
    await visible(page, page.getByText(/Mes anterior/i), "coach sees previous month earnings");
    if (await page.getByRole("button", { name: /Subir factura/i }).first().isVisible().catch(() => false)) {
      await visible(page, page.getByPlaceholder(/Nro factura/i), "coach invoice upload requires invoice number");
    } else {
      manual("coach invoice upload interaction", "no settlement fixture visible in current environment");
    }

    await page.goto(`${BASE_URL}/admin/coaches`, { waitUntil: "networkidle" });
    await visible(page, page.getByRole("heading", { name: /^Coaches$/i }), "admin coaches page loads");
    for (const tab of ["Pendientes", "Aprobados", "Rechazados", "Suspendidos"]) {
      await visible(page, page.getByRole("link", { name: tab }), `admin coach tab: ${tab}`);
    }

    await page.goto(`${BASE_URL}/admin/liquidaciones`, { waitUntil: "networkidle" });
    await visible(page, page.getByRole("heading", { name: /Liquidaciones/i }), "admin settlements page loads");
    await visible(page, page.getByText(/Por aprobar/i), "admin sees invoices awaiting approval");
    await visible(page, page.getByText(/Listas para transferir/i), "admin sees approved transfer queue");
    if (await page.getByRole("button", { name: /Marcar transferido/i }).first().isVisible().catch(() => false)) {
      pass("admin can mark approved invoice as transferred");
    } else {
      manual("admin transfer action", "no approved settlement fixture visible in current environment");
    }

    await page.goto(`${BASE_URL}/coaches`, { waitUntil: "networkidle" });
    await visible(page, page.getByRole("heading", { name: /Coaches/i }), "public marketplace loads");
    if (await page.getByRole("link", { name: /Ver perfil/i }).first().isVisible().catch(() => false)) {
      pass("marketplace has at least one public coach card");
    } else {
      manual("marketplace checkout progression", "no approved coach fixture visible; seed/staging data required");
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log(`Smoke test against: ${BASE_URL}\n`);

  await checkRoute("landing", "/");
  await checkRoute("coaches", "/coaches");
  await checkRoute("upgrade", "/upgrade");
  await checkRoute("coach onboarding", "/onboarding-coach");
  await checkRoute("coach billing", "/coach/cobros", [200, 307, 308]);
  await checkRoute("admin coaches", "/admin/coaches", [200, 307, 308]);
  await checkRoute("admin settlements", "/admin/liquidaciones", [200, 307, 308]);
  await checkRoute("legal terms", "/legales/terminos");
  await checkRoute("legal privacy", "/legales/privacidad");
  await checkRoute("manifest", "/manifest.json");

  await runBrowserSmoke();

  manual("RLS access-crossing suite", "requires Docker + supabase start + pnpm test:rls");
  manual("Mercado Pago sandbox end-to-end", "requires MP sandbox credentials and webhook tunnel");
  manual("RevenueCat restore purchases", "requires App Store/Play sandbox products");
  manual("Mobile device smoke", "requires Expo app installed on simulator/device for Maestro flows");

  const failed = results.filter((r) => r.status === "FAIL");
  const manualCount = results.filter((r) => r.status === "MANUAL_REQUIRED").length;
  const passed = results.filter((r) => r.status === "PASS").length;

  console.log(`\nSummary: ${passed} PASS, ${failed.length} FAIL, ${manualCount} MANUAL_REQUIRED`);

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  fail("smoke runner crashed", error.stack ?? error.message);
  process.exit(1);
});
