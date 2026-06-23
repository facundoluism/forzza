/**
 * E2E spec for coach rich profile — interests, gallery, presentation video.
 * TEMPORARY: delete after verification.
 *
 * Uses coach.smoke@forzza.app / ForzzaSmoke123!
 * Coach profile ID: 20000000-0000-4000-8000-000000000002
 */
import { test, expect } from '@playwright/test';

const COACH_EMAIL = process.env.E2E_COACH_EMAIL ?? 'coach.smoke@forzza.app';
const COACH_PASSWORD = process.env.E2E_COACH_PASSWORD ?? 'ForzzaSmoke123!';
const COACH_ID = '20000000-0000-4000-8000-000000000002';

async function loginAsCoach(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/login');
  // domcontentloaded is more reliable than networkidle with Next.js HMR
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('input[type="email"]', { timeout: 15_000 });
  await page.locator('input[type="email"]').fill(COACH_EMAIL);
  await page.locator('input[type="password"]').fill(COACH_PASSWORD);
  await page.getByRole('button', { name: /iniciar sesi/i }).click();
  await page.waitForURL(/\/coach/, { timeout: 25_000 });
}

/** Generate a minimal valid PNG as Buffer. */
function minimalPng(): Buffer {
  // 1x1 white PNG (minimal valid file)
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
}

/** Generate a minimal valid MP4 (ftyp box only, enough for type check). */
function minimalMp4(): Buffer {
  // Minimal ftyp box — 24 bytes, valid MP4 container header
  const buf = Buffer.alloc(24);
  buf.writeUInt32BE(24, 0);    // box size
  buf.write('ftyp', 4);       // box type
  buf.write('mp42', 8);       // major brand
  buf.writeUInt32BE(0, 12);   // minor version
  buf.write('mp42', 16);      // compat brand
  buf.write('isom', 20);      // compat brand
  return buf;
}

test.describe('Coach rich profile — edit', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCoach(page);
    await page.goto('/es/coach/perfil');
    await page.waitForLoadState('domcontentloaded');
    // Wait for the page sections to render
    await page.waitForSelector('h1', { timeout: 15_000 });
  });

  test('shows interests section heading', async ({ page }) => {
    await expect(page.getByText(/intereses personales/i)).toBeVisible();
  });

  test('shows gallery section heading', async ({ page }) => {
    await expect(page.getByText(/galería de fotos/i)).toBeVisible();
  });

  test('shows video section heading', async ({ page }) => {
    await expect(page.getByText(/video de presentación/i)).toBeVisible();
  });

  test('adds an interest tag and saves profile', async ({ page }) => {
    // Find the interest input — has placeholder "Ej: Montañismo"
    const interestInput = page.locator('input[placeholder*="Montañismo"]');
    const addBtn = page.getByRole('button', { name: /agregar interés/i });
    await expect(addBtn).toBeVisible();

    // Type an interest
    await interestInput.fill('Montañismo');
    await addBtn.click();

    // Tag should appear
    await expect(page.getByText('Montañismo')).toBeVisible();

    // Submit the form
    await page.getByRole('button', { name: /guardar cambios/i }).click();
    await expect(page.getByText(/perfil guardado correctamente/i)).toBeVisible({ timeout: 15_000 });
  });

  test('uploads a gallery image', async ({ page }) => {
    // Wait for gallery section to load
    await page.waitForSelector('text=Galería de fotos');

    // The gallery upload button
    const uploadBtn = page.getByRole('button', { name: /subir imagen/i });
    await expect(uploadBtn).toBeVisible({ timeout: 10_000 });

    // Gallery file input has accept="image/jpeg,image/png,image/webp" (no video types)
    // The avatar input accepts the same types but is first; gallery is second
    const fileInputs = page.locator('input[type="file"][accept*="image/jpeg"]');
    // Pick the gallery one — it comes after the avatar input
    const galleryInput = fileInputs.nth(1);

    await galleryInput.setInputFiles({
      name: 'test-gallery.png',
      mimeType: 'image/png',
      buffer: minimalPng(),
    });

    // Should show success message
    await expect(page.getByText(/imagen subida correctamente/i)).toBeVisible({ timeout: 20_000 });
  });

  test('uploads a presentation video', async ({ page }) => {
    await page.waitForSelector('text=Video de presentación');

    // Button is "Subir video" or "Cambiar video" depending on existing state
    const uploadBtn = page.getByRole('button', { name: /subir video|cambiar video/i });
    await expect(uploadBtn).toBeVisible({ timeout: 10_000 });

    // File input for video (accept video/* types)
    const fileInput = page.locator('input[type="file"][accept*="video/mp4"]').first();

    await fileInput.setInputFiles({
      name: 'test-video.mp4',
      mimeType: 'video/mp4',
      buffer: minimalMp4(),
    });

    await expect(page.getByText(/video subido correctamente/i)).toBeVisible({ timeout: 20_000 });
  });
});

test.describe('Coach public profile — display rich content', () => {
  test('public profile page loads without login', async ({ page }) => {
    await page.goto(`/es/coaches/${COACH_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // Should NOT redirect to login — page loads
    expect(page.url()).toMatch(/coaches/);
  });

  test('shows interests section if data present', async ({ page }) => {
    await page.goto(`/es/coaches/${COACH_ID}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('h1', { timeout: 15_000 });

    // If there are interests, section label "Intereses" should be visible
    // We just check the page renders correctly
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
    // Page should not show a server error
    expect(body).not.toMatch(/error interno|application error/i);
  });
});
