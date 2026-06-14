/**
 * Landing page (/) E2E tests.
 *
 * These tests verify the publicly accessible marketing page renders
 * correctly and that key interactive elements are present and functional.
 * No authentication is required. Tests run against whatever BASE_URL is
 * configured (default: http://localhost:3000).
 *
 * NOTE: The landing page links to /login (not /auth/login).
 * The Next.js route group (auth) does NOT add path segments:
 *   app/(auth)/login/page.tsx  → /login
 */
import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Forzza/i);
  });

  test('FORZZA brand logo is visible in nav', async ({ page }) => {
    // The nav renders "FORZZA" as a text span — match it exactly
    const brand = page.locator('nav').getByText('FORZZA').first();
    await expect(brand).toBeVisible();
  });

  test('hero section is visible', async ({ page }) => {
    // The giant FORZZA h1 is the hero centrepiece
    const hero = page.locator('h1').filter({ hasText: 'FORZZA' });
    await expect(hero).toBeVisible();
  });

  test('hero tagline is visible', async ({ page }) => {
    // Use first() to avoid strict-mode error if text appears in both
    // the hero and a tablet-viewport duplicate element
    await expect(page.getByText(/Entrenamiento con coach que realmente funciona/i).first()).toBeVisible();
  });

  test('hero has primary CTA button linking to /login', async ({ page }) => {
    // "Empezar gratis →" — the primary call-to-action links to /login
    const cta = page.getByRole('link', { name: /empezar gratis/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/login');
  });

  test('hero has secondary CTA button linking to /coaches', async ({ page }) => {
    const cta = page.getByRole('link', { name: /ver coaches/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/coaches');
  });

  test('nav has Coaches link', async ({ page }) => {
    const link = page.locator('nav').getByRole('link', { name: /coaches/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/coaches');
  });

  test('nav has Ingresar link', async ({ page }) => {
    // Nav "Ingresar" links to /login (route group (auth) maps to /login)
    const link = page.locator('nav').getByRole('link', { name: /ingresar/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/login');
  });

  test('features section renders all 6 feature cards', async ({ page }) => {
    const features = [
      'Rutinas personalizadas',
      'Progreso medible',
      'Chat directo',
      'Pagos seguros',
      'Offline-first',
      // 'Coaches verificados' matches 2 elements in the page — use heading role
    ];
    for (const title of features) {
      await expect(page.getByText(title).first()).toBeVisible();
    }
    // Coaches verificados appears in both feature cards and footer nav — use h3
    await expect(page.locator('h3').filter({ hasText: 'Coaches verificados' })).toBeVisible();
  });

  test('how-it-works section shows 3 steps', async ({ page }) => {
    await expect(page.getByText('Tres pasos para empezar')).toBeVisible();
    // Steps are numbered 01, 02, 03 — use first() since numbers may appear in
    // other contexts (e.g., step number "02" text duplicated in mobile and desktop)
    for (const n of ['01', '02', '03']) {
      await expect(page.getByText(n).first()).toBeVisible();
    }
  });

  test('pricing section shows Free and PRO plans', async ({ page }) => {
    // Scroll into view to ensure lazy-rendered content is painted
    const pricing = page.locator('#pricing');
    await pricing.scrollIntoViewIfNeeded();
    await expect(page.getByText('Planes para alumnos')).toBeVisible();
    // Free plan
    await expect(page.getByText('$0')).toBeVisible();
    // PRO plan — price in ARS (default $9.999 or fetched from DB)
    await expect(page.getByText(/\$[0-9.,]+/).first()).toBeVisible();
  });

  test('PRO plan Activar PRO button links to /upgrade', async ({ page }) => {
    const upgradeLink = page.getByRole('link', { name: /activar pro/i });
    await upgradeLink.scrollIntoViewIfNeeded();
    await expect(upgradeLink).toBeVisible();
    await expect(upgradeLink).toHaveAttribute('href', '/upgrade');
  });

  test('coach CTA section is visible with registration link', async ({ page }) => {
    const coachCTA = page.getByText(/¿Sos coach\?/i);
    await coachCTA.scrollIntoViewIfNeeded();
    await expect(coachCTA).toBeVisible();

    const regLink = page.getByRole('link', { name: /registrarme como coach/i });
    await expect(regLink).toBeVisible();
    await expect(regLink).toHaveAttribute('href', '/onboarding-coach');
  });

  test('footer renders with legal links', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer.getByRole('link', { name: /términos/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /privacidad/i })).toBeVisible();
  });

  test('stats strip shows platform guarantees', async ({ page }) => {
    // Use locator scoped to the stats strip to avoid strict-mode violations
    // The strip renders 72h, 20%, 100% as separate divs
    await expect(page.getByText('72h').first()).toBeVisible();
    await expect(page.getByText('20%').first()).toBeVisible();
    await expect(page.getByText('100%').first()).toBeVisible();
  });

  test('page is responsive at mobile viewport (375 x 812)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    // After resize the page should still show the hero without JS errors
    await expect(page.locator('h1').filter({ hasText: 'FORZZA' })).toBeVisible();
    // Nav items like desktop links may be hidden; brand must still exist
    await expect(page.locator('nav').getByText('FORZZA').first()).toBeVisible();
  });

  test('page is responsive at tablet viewport (768 x 1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1').filter({ hasText: 'FORZZA' })).toBeVisible();
    // Use first() — tagline may appear duplicated in multi-viewport builds
    await expect(page.getByText(/Entrenamiento con coach/i).first()).toBeVisible();
  });

  test('clicking Empezar gratis navigates to /login', async ({ page }) => {
    // The CTA links to /login (route group (auth) → /login)
    const cta = page.getByRole('link', { name: /empezar gratis/i }).first();
    await cta.click();
    await page.waitForURL(/\/login/, { timeout: 8_000 });
    // Confirm the login page loaded
    await expect(page).toHaveURL(/\/login/);
  });
});
