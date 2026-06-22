/**
 * Coach avatar upload/delete E2E spec.
 *
 * Requires real Supabase credentials:
 *   E2E_COACH_EMAIL=coach.smoke@forzza.app
 *   E2E_COACH_PASSWORD=ForzzaSmoke123!
 *
 * Tests are skipped automatically when credentials are not provided.
 */
import { test, expect } from '@playwright/test';

const COACH_EMAIL = process.env.E2E_COACH_EMAIL ?? '';
const COACH_PASSWORD = process.env.E2E_COACH_PASSWORD ?? '';
const SKIP = !COACH_EMAIL || !COACH_PASSWORD;

/**
 * Login via the actual login page.
 * The login form uses inline labels (not htmlFor), so we select inputs by type.
 */
async function loginAsCoach(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // Fill by input type — the form has type="email" and type="password"
  await page.locator('input[type="email"]').fill(COACH_EMAIL);
  await page.locator('input[type="password"]').fill(COACH_PASSWORD);
  await page.getByRole('button', { name: /iniciar sesi/i }).click();
  // Next.js uses window.location.href so wait for full navigation to /coach/*
  await page.waitForURL(/\/coach/, { timeout: 20_000 });
}

test.describe('Coach avatar — upload and delete', () => {
  test.beforeEach(async ({ page }) => {
    if (SKIP) {
      test.skip();
      return;
    }
    await loginAsCoach(page);
    await page.goto('/coach/perfil');
    await page.waitForLoadState('networkidle');
  });

  test('shows avatar section heading', async ({ page }) => {
    if (SKIP) { test.skip(); return; }
    await expect(page.getByText(/foto de perfil/i)).toBeVisible();
  });

  test('shows upload button', async ({ page }) => {
    if (SKIP) { test.skip(); return; }
    const uploadBtn = page.getByRole('button', { name: /subir foto|cambiar foto/i });
    await expect(uploadBtn).toBeVisible();
  });

  test('uploads a PNG and shows success message', async ({ page }) => {
    if (SKIP) { test.skip(); return; }

    // Create a minimal 1×1 red PNG via canvas in-browser
    const pngBytes: number[] = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1; canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) { ctx.fillStyle = '#FF0000'; ctx.fillRect(0, 0, 1, 1); }
      const dataURL = canvas.toDataURL('image/png');
      const base64 = dataURL.split(',')[1] ?? '';
      const binary = atob(base64);
      const bytes: number[] = [];
      for (let i = 0; i < binary.length; i++) bytes.push(binary.charCodeAt(i));
      return bytes;
    });

    const fileInput = page.locator('input[type="file"][accept*="image"]');
    await fileInput.setInputFiles({
      name: 'test-avatar.png',
      mimeType: 'image/png',
      buffer: Buffer.from(pngBytes),
    });

    await expect(page.getByText(/foto de perfil actualizada correctamente/i)).toBeVisible({
      timeout: 20_000,
    });

    // Avatar <img> must now be visible
    await expect(page.locator('img[alt*="foto de perfil" i]')).toBeVisible();
  });

  test('deletes the avatar with two-step confirmation', async ({ page }) => {
    if (SKIP) { test.skip(); return; }

    // Ensure avatar exists (upload if missing)
    const hasAvatar = await page.locator('img[alt*="foto de perfil" i]').isVisible().catch(() => false);
    if (!hasAvatar) {
      const pngBytes: number[] = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1; canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) { ctx.fillStyle = '#00FF00'; ctx.fillRect(0, 0, 1, 1); }
        const dataURL = canvas.toDataURL('image/png');
        const base64 = dataURL.split(',')[1] ?? '';
        const binary = atob(base64);
        const bytes: number[] = [];
        for (let i = 0; i < binary.length; i++) bytes.push(binary.charCodeAt(i));
        return bytes;
      });
      const fileInput = page.locator('input[type="file"][accept*="image"]');
      await fileInput.setInputFiles({
        name: 'pre-delete.png',
        mimeType: 'image/png',
        buffer: Buffer.from(pngBytes),
      });
      await expect(page.getByText(/foto de perfil actualizada correctamente/i)).toBeVisible({ timeout: 20_000 });
    }

    // First click → shows "Confirmar eliminación"
    await page.getByRole('button', { name: /eliminar foto/i }).click();
    const confirmBtn = page.getByRole('button', { name: /confirmar eliminación/i });
    await expect(confirmBtn).toBeVisible();

    // Second click → fires DELETE
    await confirmBtn.click();
    await expect(page.getByText(/foto de perfil eliminada/i)).toBeVisible({ timeout: 20_000 });

    // Avatar image should be gone
    await expect(page.locator('img[alt*="foto de perfil" i]')).not.toBeVisible();
  });
});
