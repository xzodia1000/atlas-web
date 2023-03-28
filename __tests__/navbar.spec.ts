import { test, expect } from '@playwright/test';

test.describe('Navigation Bar Component', () => {
  let baseURL: string;

  test.beforeAll(async () => {
    // Set the base URL for your application
    baseURL = 'http://localhost:3001';
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/login`);
    const url = page.url();

    if (url !== `${baseURL}/dashboard`) {
      await page.goto(`${baseURL}/login`);
      await page.waitForSelector('form');
      await page.fill('[id="email"]', 'admin@atlas.com');
      await page.fill('[id="password"]', '123456789');
      await page.click('button[type="submit"]');
      await page.waitForURL(`${baseURL}/dashboard`, { timeout: 50000 });
    }

    await page.waitForSelector('#aside');
  });

  test('should render the navigation bar', async ({ page }) => {
    expect(page.url()).toBe(`${baseURL}/dashboard`);
    const navbar = await page.$('#aside');
    expect(navbar).toBeTruthy();
  });

  test('should have the correct number of navigation items', async ({ page }) => {
    const navItems = await page.$$('#aside .isActive');
    expect(navItems.length).toBe(1); // You should have 7 navigation items in total.
  });

  test('should navigate to the correct page when clicking on a navigation item', async ({
    page
  }) => {
    const navItem = await page.$('#aside #moderation');
    await navItem?.click();
    await page.waitForURL(`${baseURL}/dashboard#moderation`, { timeout: 50000 });

    const currentRoute = await page.evaluate(() => window.location.hash);
    expect(currentRoute).toBe('#moderation');
  });
});
