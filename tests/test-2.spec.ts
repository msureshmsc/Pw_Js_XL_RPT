import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link', { name: 'Forgot Password' }).click();
  await page.getByRole('textbox', { name: 'E-mail' }).click();
  await page.getByRole('textbox', { name: 'E-mail' }).fill('Ram@gmail.com');
  await page.getByRole('button', { name: 'Retrieve password' }).click();
  await page.getByRole('heading', { name: 'Internal Server Error' }).click();
  await page.getByRole('heading', { name: 'Forgot Password' }).click();
  await page.getByText('E-mail').click();
});