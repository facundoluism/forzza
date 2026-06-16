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
const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && !SUPABASE_URL.includes("placeholder"));
const SMOKE_PASSWORD = "ForzzaSmoke123!";

const SMOKE_IDS = {
  ownerUser: "10000000-0000-4000-8000-000000000001",
  coachUser: "10000000-0000-4000-8000-000000000002",
  studentUser: "10000000-0000-4000-8000-000000000003",
  coachProfile: "20000000-0000-4000-8000-000000000002",
  package: "30000000-0000-4000-8000-000000000001",
  assignment: "40000000-0000-4000-8000-000000000001",
  payment: "50000000-0000-4000-8000-000000000001",
  routine: "60000000-0000-4000-8000-000000000001",
  workoutSession: "70000000-0000-4000-8000-000000000001",
  settlementPendingInvoice: "80000000-0000-4000-8000-000000000001",
  settlementInvoiced: "80000000-0000-4000-8000-000000000002",
  settlementApproved: "80000000-0000-4000-8000-000000000003",
};

const SMOKE_EMAILS = {
  owner: "owner.smoke@forzza.app",
  coach: "coach.smoke@forzza.app",
  student: "alumno.smoke@forzza.app",
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

function failOrManual(name, detail = "") {
  if (REQUIRE_FIXTURES) fail(name, detail);
  else manual(name, detail);
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

async function checkRedirect(name, path, expectedLocationPattern) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { redirect: "manual" });
    const location = res.headers.get("location") ?? "";
    if (
      [301, 302, 303, 307, 308].includes(res.status) &&
      expectedLocationPattern.test(location)
    ) {
      pass(`redirect: ${name}`, `${path} -> ${res.status} ${location}`);
      return true;
    }
    fail(
      `redirect: ${name}`,
      `${path} expected redirect matching ${expectedLocationPattern}, got ${res.status} ${location || "(no location)"}`
    );
    return false;
  } catch (error) {
    fail(`redirect: ${name}`, error.message);
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

async function restSelect(path, query) {
  const url = `${SUPABASE_URL}/rest/v1/${path}?${query}`;
  const res = await fetch(url, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`${path} -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

function hasRow(rows, predicate) {
  return Array.isArray(rows) && rows.some(predicate);
}

async function loginAs(page, email, expectedUrlPattern, name) {
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(SMOKE_PASSWORD);
    await Promise.all([
      page.waitForURL(expectedUrlPattern, { timeout: 15000 }),
      page.getByRole("button", { name: /Iniciar sesi[oó]n/i }).click(),
    ]);
    pass(name, email);
    return true;
  } catch (error) {
    failOrManual(name, `could not login as ${email}: ${error.message}`);
    return false;
  }
}

async function runFixtureSmoke() {
  if (!SUPABASE_CONFIGURED || !SERVICE_ROLE_KEY) {
    failOrManual(
      "Supabase smoke fixture data",
      "set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run supabase seed --local"
    );
    return;
  }

  try {
    const users = await restSelect(
      "users",
      `id=in.(${SMOKE_IDS.ownerUser},${SMOKE_IDS.coachUser},${SMOKE_IDS.studentUser})&select=id,role,country`
    );
    if (
      hasRow(users, (u) => u.id === SMOKE_IDS.ownerUser && u.role === "owner") &&
      hasRow(users, (u) => u.id === SMOKE_IDS.coachUser && u.role === "coach") &&
      hasRow(users, (u) => u.id === SMOKE_IDS.studentUser && u.role === "student")
    ) {
      pass("fixture users: owner, coach and student roles");
    } else {
      failOrManual("fixture users: owner, coach and student roles", "expected smoke users not found");
    }

    const coaches = await restSelect(
      "coach_profiles",
      `id=eq.${SMOKE_IDS.coachProfile}&select=id,user_id,status,display_name,billing_model,active_student_count`
    );
    if (hasRow(coaches, (c) => c.status === "approved" && c.user_id === SMOKE_IDS.coachUser)) {
      pass("fixture coach: approved profile visible to marketplace");
    } else {
      failOrManual("fixture coach: approved profile visible to marketplace", "approved coach missing");
    }

    const packages = await restSelect(
      "coach_packages",
      `id=eq.${SMOKE_IDS.package}&select=id,coach_id,tier,price,country,active`
    );
    if (
      hasRow(
        packages,
        (p) =>
          p.coach_id === SMOKE_IDS.coachProfile &&
          p.tier === "pro" &&
          p.price >= 500000 &&
          p.active === true
      )
    ) {
      pass("fixture package: active AR pro package above country floor");
    } else {
      failOrManual("fixture package: active AR pro package above country floor", "package missing or below floor");
    }

    const assignments = await restSelect(
      "coach_assignments",
      `id=eq.${SMOKE_IDS.assignment}&select=id,student_id,coach_id,package_id,payment_id,routine_id,status`
    );
    if (
      hasRow(
        assignments,
        (a) =>
          a.student_id === SMOKE_IDS.studentUser &&
          a.coach_id === SMOKE_IDS.coachProfile &&
          a.package_id === SMOKE_IDS.package &&
          a.payment_id === SMOKE_IDS.payment &&
          a.routine_id === SMOKE_IDS.routine &&
          a.status === "active"
      )
    ) {
      pass("fixture assignment: paid student is active with coach and assigned routine");
    } else {
      failOrManual(
        "fixture assignment: paid student is active with coach and assigned routine",
        "active assignment missing or not linked to routine"
      );
    }

    const payments = await restSelect(
      "payments",
      `id=eq.${SMOKE_IDS.payment}&select=id,user_id,coach_id,assignment_id,amount,currency,status,gateway,gateway_payment_id`
    );
    if (
      hasRow(
        payments,
        (p) =>
          p.user_id === SMOKE_IDS.studentUser &&
          p.coach_id === SMOKE_IDS.coachProfile &&
          p.assignment_id === SMOKE_IDS.assignment &&
          p.amount === 900000 &&
          p.status === "approved" &&
          p.gateway === "mercadopago"
      )
    ) {
      pass("fixture payment: Mercado Pago approved coach package");
    } else {
      failOrManual("fixture payment: Mercado Pago approved coach package", "approved payment missing");
    }

    const routines = await restSelect(
      "routines",
      `id=eq.${SMOKE_IDS.routine}&select=id,student_id,coach_id,title,exercises`
    );
    const routine = Array.isArray(routines) ? routines[0] : null;
    const routineExerciseIds = Array.isArray(routine?.exercises)
      ? routine.exercises.map((exercise) => exercise.exercise_id).filter(Boolean)
      : [];
    if (
      routine &&
      routine.student_id === SMOKE_IDS.studentUser &&
      routine.coach_id === SMOKE_IDS.coachProfile &&
      Array.isArray(routine.exercises) &&
      routine.exercises.length >= 3 &&
      routine.exercises.every((exercise) => Boolean(exercise.exercise_id))
    ) {
      pass("fixture student routine: linked exercises with preview ids");
    } else {
      failOrManual("fixture student routine: linked exercises with preview ids", "routine missing linked exercises");
    }

    const sessions = await restSelect(
      "workout_sessions",
      `id=eq.${SMOKE_IDS.workoutSession}&select=id,student_id,routine_id,status,started_at,completed_at,sets_data`
    );
    const workoutSession = Array.isArray(sessions) ? sessions[0] : null;
    const sessionExerciseIds = Array.isArray(workoutSession?.sets_data)
      ? workoutSession.sets_data.map((exercise) => exercise.exercise_id).filter(Boolean)
      : [];
    const sessionUsesRoutineExercises =
      sessionExerciseIds.length >= 2 &&
      sessionExerciseIds.every((exerciseId) => routineExerciseIds.includes(exerciseId));
    const sessionHasLoggedSets =
      Array.isArray(workoutSession?.sets_data) &&
      workoutSession.sets_data.every(
        (exercise) =>
          Array.isArray(exercise.sets) &&
          exercise.sets.length > 0 &&
          exercise.sets.every((set) => typeof set.set_number === "number")
      );
    if (
      workoutSession &&
      workoutSession.student_id === SMOKE_IDS.studentUser &&
      workoutSession.routine_id === SMOKE_IDS.routine &&
      workoutSession.status === "completed" &&
      workoutSession.completed_at &&
      sessionUsesRoutineExercises &&
      sessionHasLoggedSets
    ) {
      pass("fixture workout session: student completed linked routine with logged sets");
    } else {
      failOrManual(
        "fixture workout session: student completed linked routine with logged sets",
        "completed workout session missing or not aligned with routine exercise ids"
      );
    }

    const settlements = await restSelect(
      "settlements",
      `coach_id=eq.${SMOKE_IDS.coachProfile}&select=id,status,gross_amount,commission,net_amount,invoice_number,invoice_path`
    );
    const hasPendingInvoice = hasRow(
      settlements,
      (s) => s.id === SMOKE_IDS.settlementPendingInvoice && s.status === "pending_invoice"
    );
    const hasInvoiced = hasRow(
      settlements,
      (s) =>
        s.id === SMOKE_IDS.settlementInvoiced &&
        s.status === "invoiced" &&
        s.invoice_number &&
        s.invoice_path
    );
    const hasApproved = hasRow(
      settlements,
      (s) =>
        s.id === SMOKE_IDS.settlementApproved &&
        s.status === "approved" &&
        s.gross_amount === 900000 &&
        s.commission === 180000 &&
        s.net_amount === 720000 &&
        s.invoice_number &&
        s.invoice_path
    );
    if (hasPendingInvoice && hasInvoiced && hasApproved) {
      pass("fixture settlements: pending invoice, invoiced approval queue, approved transfer queue");
    } else {
      failOrManual("fixture settlements: pending invoice, invoiced approval queue, approved transfer queue", "expected settlement states missing");
    }
  } catch (error) {
    failOrManual("Supabase smoke fixture data", error.message);
  }
}

async function checkCoachBilling(page) {
  await page.goto(`${BASE_URL}/coach/cobros`, { waitUntil: "networkidle" });
  await visible(page, page.getByRole("heading", { name: /Cobros/i }), "coach billing page loads");
  await visible(page, page.getByText(/Este mes/i), "coach sees current month earnings");
  await visible(page, page.getByText(/Mes anterior/i), "coach sees previous month earnings");
  if (await page.getByRole("button", { name: /Subir factura/i }).first().isVisible().catch(() => false)) {
    await visible(page, page.getByPlaceholder(/Nro factura/i), "coach invoice upload requires invoice number");
  } else {
    manual("coach invoice upload interaction", "no settlement fixture visible in current environment");
  }
}

async function checkAdminBackoffice(page) {
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

    if (SUPABASE_CONFIGURED) {
      const coachPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
      try {
        if (await loginAs(coachPage, SMOKE_EMAILS.coach, /\/coach(?:\/|$)/, "coach fixture can login")) {
          await checkCoachBilling(coachPage);
        }
      } finally {
        await coachPage.close();
      }

      const adminPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
      try {
        if (await loginAs(adminPage, SMOKE_EMAILS.owner, /\/admin(?:\/|$)/, "owner fixture can login")) {
          await checkAdminBackoffice(adminPage);
        }
      } finally {
        await adminPage.close();
      }
    } else {
      await checkCoachBilling(page);
      await checkAdminBackoffice(page);
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
  if (SUPABASE_CONFIGURED) {
    await checkRedirect("unauthenticated coach goes to login", "/coach/cobros", /\/login(?:\?|$)/);
    await checkRedirect("unauthenticated admin goes to login", "/admin/liquidaciones", /\/login(?:\?|$)/);
  } else {
    manual("auth redirects", "Supabase not configured; dev mode intentionally skips protected-route redirects");
  }

  await runFixtureSmoke();
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
