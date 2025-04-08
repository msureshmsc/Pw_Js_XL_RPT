import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://demoqa.com/');
  await page.locator('path').first().click();
  await page.getByRole('listitem').filter({ hasText: 'Text Box' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).fill('Ram');
  await page.getByRole('textbox', { name: 'name@example.com' }).fill('Seeta@gmail.com');
  await page.getByRole('textbox', { name: 'Current Address' }).fill('Ayothiya');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('#name')).toContainText('Name:Ram');  
  await expect(page.locator('#email')).toContainText('Email:Seeta@gmail.com');
  await expect(page.locator('#output')).toContainText('Current Address :Ayothiya');
  await expect(page.locator('#output')).toContainText('Permananet Address :Srilanka');
});