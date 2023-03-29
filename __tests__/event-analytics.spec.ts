import { test, expect } from '@playwright/test';

test.describe('Event Analytics', () => {
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
    const navItem = await page.$('#aside #event-analytics');
    await navItem?.click();
    await page.waitForURL(`${baseURL}/dashboard#event-analytics`, { timeout: 50000 });
    await page.waitForSelector('thead');
  });

  test('moderation table is rendered correctly', async ({ page }) => {
    const tableHeaders = await page.$$eval('th', (headers) =>
      headers.map((header) => header.textContent)
    );

    expect(tableHeaders).toEqual([
      'Event ID',
      'Event Host',
      'Event Name',
      'Event Active Date',
      'Number of Participants'
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
