import { test,expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groupedTestCases = new Map();

const records = parse(fs.readFileSync(path.join(__dirname, '../testdata/demoqatest1.csv')), {
  columns: true,
  skip_empty_lines: true
});

const softExpect = expect.configure({ soft: true }); 

for (const record of records) {
  test(`validate: ${record.fullname}`, async ({ page,baseURL }) => {
    
    console.log(record.email, record.currentAddress, record.permanentAddress);

    let fullname = `${record.fullname}`;
    let email = `${record.email}`;
    let currentAddress = `${record.currentAddress}`;
    let permanentAddress = `${record.permanentAddress}`;
   
    await page.goto(`${baseURL}`);
    await page.getByPlaceholder('Full Name').fill(`${fullname}`);
    await page.getByPlaceholder('name@example.com').fill(`${email}`);
    await page.getByPlaceholder('Current Address').fill(`${currentAddress}`);
    await page.locator('#permanentAddress').fill(`${permanentAddress}`);
  
    await page.getByRole('button', { name: 'Submit' }).click();

    await softExpect(page.getByText(`Name:${fullname}`),`Validate fullname as ${fullname}` ).toBeVisible();
    await softExpect(page.getByText(`Email:${email}`),`Validate email as ${email}`).toBeVisible();
    await softExpect(page.getByText(`Current Address :${currentAddress}`),`Validate currentAddress as ${currentAddress}`).toBeVisible();
    await softExpect(page.getByText(`Permananet Address :${permanentAddress}`),`Validate permanentAddress as ${permanentAddress}`).toBeVisible();

    await expect(page.locator('#name')).toContainText('Name:namefive');

    await expect(page.getByText('Name:namefive')).toBeVisible();

  })};
