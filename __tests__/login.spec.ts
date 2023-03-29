import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  let baseURL: string;

  test.beforeAll(async () => {
    // Set the base URL for your application
    baseURL = 'http://localhost:3001';
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/login`);
    await page.waitForSelector('form');
  });

  test('should display the login form', async ({ page }) => {
    const form = await page.$('form');
    expect(form).toBeTruthy();
  });

  test('should display an error for an invalid email', async ({ page }) => {
    await page.fill('[id="email"]', 'invalid@email.com');
    await page.fill('[id="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    await page.waitForSelector('form .chakra-form__error-message', { timeout: 5000 });
    const errorMessage = await page.textContent('form .chakra-form__error-message');
    expect(errorMessage).toBe('Invalid Email');
  });

  test('should display an error for an invalid password', async ({ page }) => {
    await page.fill('[id="email"]', 'admin@atlas.com');
    await page.fill('[id="password"]', 'invalid-password');
    await page.click('button[type="submit"]');
    await page.waitForSelector('form .chakra-form__error-message', { timeout: 5000 });
    const errorMessage = await page.textContent('form .chakra-form__error-message');
    expect(errorMessage).toBe('Invalid Password');
  });

  test('should successfully log in with valid credentials and redirect to dashboard', async ({
    page
  }) => {
    await page.fill('[id="email"]', 'admin@atlas.com');
    await page.fill('[id="password"]', '123456789');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${baseURL}/dashboard`, { timeout: 50000 });
    expect(page.url()).toBe(`${baseURL}/dashboard`);
  });
});
