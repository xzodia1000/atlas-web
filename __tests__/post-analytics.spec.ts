import { test, expect } from '@playwright/test';

test.describe('Post Analytics', () => {
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
    const navItem = await page.$('#aside #post-analytics');
    await navItem?.click();
    await page.waitForURL(`${baseURL}/dashboard#post-analytics`, { timeout: 50000 });
    await page.waitForSelector('thead');
  });

  test('moderation table is rendered correctly', async ({ page }) => {
    const tableHeaders = await page.$$eval('th', (headers) =>
      headers.map((header) => header.textContent)
    );

    expect(tableHeaders).toEqual([
      'Post ID',
      'Posted By',
      'Visibility',
      'Location',
      'Likes Count',
      'Comments Count',
      'Posted At'
    ]);
  });

  test('dropdown menu for sorting works as expected', async ({ page }) => {
    const dropdownMenu = await page.$('#Sort');
    await dropdownMenu?.click();
  });

  test('refresh button works as expected', async ({ page }) => {
    const refreshButton = await page.$('#refresh');
    await refreshButton?.click();
  });

  test('next button works as expected', async ({ page }) => {
    await page.waitForSelector('#next');
  });

  test('previous button works as expected', async ({ page }) => {
    await page.waitForSelector('#previous');
  });
});
