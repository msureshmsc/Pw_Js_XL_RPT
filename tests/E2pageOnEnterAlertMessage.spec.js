import { test, expect } from '@playwright/test';

test('Handle JS prompt and enter text', async ({ page }) => {
  // Navigate to the page
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  // Listen for the dialog and respond to it
  page.on('dialog', async dialog => {
    console.log('Dialog message:', dialog.message()); // Optional debug log
    await dialog.accept('Hello Playwright!'); // Enter text into the prompt and accept
  });

  // Click the button to trigger the JS prompt
  await page.click('text=Click for JS Prompt');
  await page.waitForTimeout(5000);

  // Verify the result text on the page
  await expect(page.locator('#result')).toHaveText('You entered: Hello Playwright!');
});
