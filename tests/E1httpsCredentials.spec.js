import { test, expect } from '@playwright/test';

test('Basic Auth using httpCredentials', async ({ browser }) => {
  const context = await browser.newContext({
    httpCredentials: {
      username: 'admin',
      password: 'admin'
    }
  });

  const page = await context.newPage();
  await page.goto('https://the-internet.herokuapp.com/basic_auth');

  // Assert success message
  await expect(page.locator('text=Congratulations!')).toBeVisible();
  await page.waitForTimeout(10000);
  await context.close();
});
