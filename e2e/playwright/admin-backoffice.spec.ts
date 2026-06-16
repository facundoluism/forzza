/**
 * Admin backoffice (/admin/*) E2E tests.
 *
 * The admin layout has the same dev-mode bypass as the coach layout:
 *   if (!supabaseUrl || supabaseUrl.includes("placeholder")) { skip requireAdmin() }
 *
 * When NEXT_PUBLIC_SUPABASE_URL is unset or contains "placeholder", the
 * layout renders without authentication. Tests use this mode to verify UI
 * structure independently of credentials.
 *
 * Routes under test:
 *   /admin             → redirects to /admin/dashboard (via page.tsx)
 *   /admin/dashboard   — metrics cards + recent-signups table
 *   /admin/coaches     — coaches management with status tabs
 *   /admin/usuarios    — users list
 *   /admin/pagos       — payments section
 *   /admin/liquidaciones — settlement approvals and transfers
 *   /admin/configuracion — configuration
 *   /admin/tickets     — support tickets
 */
import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

async function isDevMode(page: import('@playwright/test').Page): Promise<boolean> {
  const url = page.url();
  return !url.includes('/auth/login');
}

// ---------------------------------------------------------------------------
// Layout / sidebar
// ---------------------------------------------------------------------------

test.describe('Admin backoffice — sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/dashboard');
  });

  test('admin backoffice loads without crashing', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('desktop sidebar renders Forzza brand and Admin Panel label', async ({ page }) => {
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    const sidebar = page.locator('aside');
    await expect(sidebar.getByText('Forzza')).toBeVisible();
    await expect(sidebar.getByText(/^owner$/i).first()).toBeVisible();
  });

  test('sidebar has Dashboard nav link', async ({ page }) => {
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    const link = page.locator('aside').getByRole('link', { name: /dashboard/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/admin/dashboard');
  });

  test('sidebar has Coaches nav link', async ({ page }) => {
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    // Sidebar nav item renders as "🏋️ Coaches" — use partial text match
    // getByRole with name uses accessible name which includes the emoji icon
    const link = page.locator('aside').getByRole('link', { name: /coaches/i }).first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/admin/coaches');
  });

  test('sidebar has Usuarios nav link', async ({ page }) => {
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    const link = page.locator('aside').getByRole('link', { name: /usuarios/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/admin/usuarios');
  });

  test('sidebar has Pagos nav link', async ({ page }) => {
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    const link = page.locator('aside').getByRole('link', { name: /pagos/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/admin/pagos');
  });

  test('sidebar has Liquidaciones nav link', async ({ page }) => {
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    const link = page.locator('aside').getByRole('link', { name: /liquidaciones/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/admin/liquidaciones');
  });

  test('sidebar has Configuración nav link', async ({ page }) => {
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    const link = page.locator('aside').getByRole('link', { name: /configuraci/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/admin/configuracion');
  });

  test('sidebar has Tickets nav link', async ({ page }) => {
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    const link = page.locator('aside').getByRole('link', { name: /tickets/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/admin/tickets');
  });

  test('sidebar shows Owner role indicator', async ({ page }) => {
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    await expect(page.locator('aside').getByText(/^owner$/i).first()).toBeVisible();
  });

  test('sidebar has back-to-home link', async ({ page }) => {
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    const homeLink = page.locator('aside').getByRole('link', { name: /volver al inicio/i });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute('href', '/');
  });

  test('mobile header shows FORZZA brand and Owner role', async ({ page }) => {
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    await page.setViewportSize({ width: 375, height: 812 });
    // Admin mobile header renders "FORZZA" (all caps) and "Owner" separately
    // There is no single "Forzza Admin" element — brand and role are distinct spans
    const mobileHeader = page.locator('header.lg\\:hidden');
    await expect(mobileHeader.getByText('FORZZA')).toBeVisible();
    await expect(mobileHeader.getByText(/owner/i)).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// /admin/dashboard
// ---------------------------------------------------------------------------

test.describe('Admin backoffice — dashboard page', () => {
  test('dashboard page loads with heading', async ({ page }) => {
    await page.goto('/admin/dashboard');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('dashboard shows platform metrics subtitle', async ({ page }) => {
    await page.goto('/admin/dashboard');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    await expect(page.getByText(/métricas generales de la plataforma/i)).toBeVisible();
  });

  test('dashboard renders 4 metric cards', async ({ page }) => {
    await page.goto('/admin/dashboard');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    const metricLabels = [
      /usuarios activos/i,
      /coaches aprobados/i,
      /coaches pendientes/i,
      /revenue del mes/i,
    ];
    for (const label of metricLabels) {
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  test('dashboard recent signups section renders', async ({ page }) => {
    await page.goto('/admin/dashboard');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    await expect(page.getByText(/últimos registros/i)).toBeVisible();
  });

  test('dashboard shows empty state or populated table for recent signups', async ({ page }) => {
    await page.goto('/admin/dashboard');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    const emptyMsg = page.getByText(/no hay usuarios registrados/i);
    const tableHeader = page.getByRole('columnheader', { name: /id/i });
    const emptyVisible = await emptyMsg.isVisible().catch(() => false);
    const tableVisible = await tableHeader.isVisible().catch(() => false);
    expect(emptyVisible || tableVisible).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// /admin/coaches
// ---------------------------------------------------------------------------

test.describe('Admin backoffice — coaches management page', () => {
  test('coaches page loads with heading', async ({ page }) => {
    await page.goto('/admin/coaches');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    await expect(page.getByRole('heading', { name: /^coaches$/i })).toBeVisible();
  });

  test('coaches page shows management subtitle', async ({ page }) => {
    await page.goto('/admin/coaches');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    await expect(page.getByText(/gestioná las solicitudes/i)).toBeVisible();
  });

  test('coaches page renders all 4 status tabs', async ({ page }) => {
    await page.goto('/admin/coaches');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    for (const tabLabel of ['Pendientes', 'Aprobados', 'Rechazados', 'Suspendidos']) {
      await expect(page.getByRole('link', { name: tabLabel })).toBeVisible();
    }
  });

  test('Pendientes tab is active by default', async ({ page }) => {
    await page.goto('/admin/coaches');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    // The active tab has bg-[#C8FF00] text-[#0A0A0A] — URL reflects ?tab=pending
    await expect(page).toHaveURL(/\/admin\/coaches/);
    // Default tab parameter is "pending"
    const pendingLink = page.getByRole('link', { name: 'Pendientes' });
    // The active tab renders with lime background; check href has tab=pending
    await expect(pendingLink).toHaveAttribute('href', '/admin/coaches?tab=pending');
  });

  test('coaches page shows empty state or table on Pendientes tab', async ({ page }) => {
    await page.goto('/admin/coaches?tab=pending');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    // Empty state text: "No hay coaches en esta categoría por ahora."
    const emptyMsg = page.getByText(/no hay coaches en esta categor/i);
    // Desktop table header (hidden md:block) — use Coach column header
    const tableHead = page.getByRole('columnheader', { name: /coach/i });
    // Mobile card layout has no table headers — also check for a card presence
    const mobileCard = page.locator('.md\\:hidden .rounded-xl').first();
    const emptyVisible = await emptyMsg.isVisible().catch(() => false);
    const tableVisible = await tableHead.isVisible().catch(() => false);
    const cardVisible = await mobileCard.isVisible().catch(() => false);
    expect(emptyVisible || tableVisible || cardVisible).toBe(true);
  });

  test('clicking Aprobados tab navigates to ?tab=approved', async ({ page }) => {
    await page.goto('/admin/coaches');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    await page.getByRole('link', { name: 'Aprobados' }).click();
    await page.waitForURL(/tab=approved/, { timeout: 6_000 });
    await expect(page).toHaveURL(/tab=approved/);
  });

  test('coaches table headers are correct when coaches exist', async ({ page }) => {
    await page.goto('/admin/coaches?tab=approved');
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    const tableHead = page.getByRole('columnheader', { name: /coach/i });
    if (await tableHead.isVisible().catch(() => false)) {
      for (const col of ['País', 'Estado', 'Docs', 'Acción']) {
        await expect(page.getByRole('columnheader', { name: new RegExp(col, 'i') })).toBeVisible();
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Other admin routes — verify they render without 500
// ---------------------------------------------------------------------------

for (const route of [
  '/admin/usuarios',
  '/admin/pagos',
  '/admin/liquidaciones',
  '/admin/configuracion',
  '/admin/tickets',
]) {
  test(`admin route ${route} renders without application error`, async ({ page }) => {
    await page.goto(route);
    if (!(await isDevMode(page))) {
      test.skip();
      return;
    }
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByText(/application error/i)).not.toBeVisible();
  });
}

// ---------------------------------------------------------------------------
// /admin root — redirect
// ---------------------------------------------------------------------------

test('GET /admin redirects into an admin sub-route', async ({ page }) => {
  await page.goto('/admin');
  // The admin page.tsx redirects to /admin/dashboard
  await page.waitForURL(/\/admin\/dashboard/, { timeout: 8_000 });
  await expect(page).toHaveURL(/\/admin\/dashboard/);
});
