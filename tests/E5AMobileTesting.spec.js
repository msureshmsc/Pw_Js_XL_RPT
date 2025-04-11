
import { test,expect, devices } from '@playwright/test'


// Use a built-in device descriptor
const iPhone = devices['iPhone 12'];

test.use({ ...iPhone });


test('Mobile view test on iPhone 12', async ({ page }) => {

    const allDevices = Object.keys(devices);
    console.log('📱 All Playwright emulated devices:\n');
    console.log(allDevices.join('\n'));
  await page.goto('https://the-internet.herokuapp.com');
  await expect(page).toHaveTitle(/The Internet/);

  // Tap on "Form Authentication"
  await page.locator('text=Form Authentication').click();

  // Interact with login page
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');

  // Check for success message
  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});
