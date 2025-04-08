import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link', { name: 'Checkboxes' }).click();
  await page.getByRole('checkbox').first().check();
  await page.getByRole('checkbox').nth(1).uncheck();
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('listitem').filter({ hasText: 'Dropdown' }).click();
  await page.getByRole('link', { name: 'Dropdown' }).click();
  await page.locator('#dropdown').selectOption('1');
  await page.locator('#dropdown').selectOption('2');
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link', { name: 'Form Authentication' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('tomsmith');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('SuperSecretPassword!');
  await page.getByRole('button', { name: ' Login' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link', { name: 'Inputs' }).click();
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('1234567891');
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link', { name: 'JavaScript Alerts' }).click();
  await page.getByRole('button', { name: 'Click for JS Alert' }).click();
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
});