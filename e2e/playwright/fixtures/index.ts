import { type Page, expect } from '@playwright/test';

/**
 * Test credentials loaded from environment variables.
 * These should be set in .env.test or passed via CI secrets.
 * Defaults are safe placeholder values that will fail auth calls
 * gracefully so structure tests can still run without real credentials.
 */
export const TEST_CREDENTIALS = {
  coach: {
    email: process.env.E2E_COACH_EMAIL ?? 'coach@forzza.test',
    password: process.env.E2E_COACH_PASSWORD ?? 'test-password-placeholder',
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? 'admin@forzza.test',
    password: process.env.E2E_ADMIN_PASSWORD ?? 'test-password-placeholder',
  },
  student: {
    email: process.env.E2E_STUDENT_EMAIL ?? 'alumno@forzza.test',
    password: process.env.E2E_STUDENT_PASSWORD ?? 'test-password-placeholder',
  },
} as const;

/**
 * Base URL for the web app under test. Resolved from the Playwright config
 * `baseURL` which defaults to http://localhost:3000 or BASE_URL env var.
 */
export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

/**
 * Navigate to the login page and fill in credentials.
 * Does NOT assert the post-login destination; callers should check that.
 */
export async function fillLoginForm(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/auth/login');
  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('textbox', { name: /contrase/i }).fill(password);
  await page.getByRole('button', { name: /iniciar sesión/i }).click();
}

/**
 * Quick helper that waits for a given URL pattern after clicking submit.
 * Useful to confirm redirects without tight coupling to exact paths.
 */
export async function waitForNavigation(page: Page, urlPattern: string | RegExp): Promise<void> {
  await page.waitForURL(urlPattern, { timeout: 10_000 });
}

/**
 * Assert an element is visible by data-testid.
 * Centralised so we can swap selector strategy without touching every spec.
 */
export async function assertVisible(page: Page, testId: string): Promise<void> {
  await expect(page.getByTestId(testId)).toBeVisible();
}

/**
 * Assert an element is NOT present or not visible by data-testid.
 */
export async function assertHidden(page: Page, testId: string): Promise<void> {
  await expect(page.getByTestId(testId)).not.toBeVisible();
}

/**
 * Small helper to check that the page title contains a substring.
 * Playwright's built-in toHaveTitle accepts a string or regex.
 */
export async function assertTitle(page: Page, substring: string): Promise<void> {
  await expect(page).toHaveTitle(new RegExp(substring, 'i'));
}
