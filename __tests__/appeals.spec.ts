import { test, expect } from '@playwright/test';

test.describe('Appeals', () => {
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
    const navItem = await page.$('#aside #appeals');
    await navItem?.click();
    await page.waitForURL(`${baseURL}/dashboard#appeals`, { timeout: 50000 });
    await page.waitForSelector('thead');
  });

  test('moderation table is rendered correctly', async ({ page }) => {
    const tableHeaders = await page.$$eval('th', (headers) =>
      headers.map((header) => header.textContent)
    );

    expect(tableHeaders).toEqual([
      'Appeal ID',
      'Appealed By',
      'Appealed Post',
      'Reason',
      'Text',
      'Status',
      'Actions'
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
    const nextButton = await page.$('#next');
  });

  test('previous button works as expected', async ({ page }) => {
    const previousButton = await page.$('#previous');
  });
});
