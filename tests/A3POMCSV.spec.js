
//All imports
import { test,expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import {DemoQAtextboxPage} from '../PageObjectModel/DemoQAtextboxPage';


// Define `__dirname` manually
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
  test(`validate: ${record.fullname}`, async ({ page }) => {
    console.log(record.email, record.currentAddress, record.permanentAddress);
    let td_fullname = `${record.fullname}`;
    let td_email = `${record.email}`;
    let td_currentAddress = `${record.currentAddress}`;
    let td_permanentAddress = `${record.permanentAddress}`;
    const demoQAtextboxPage = new DemoQAtextboxPage(page);
    await page.goto('https://demoqa.com/text-box');  

    await demoQAtextboxPage.EnterTextBoxValues(td_fullname,td_email,td_currentAddress,td_permanentAddress);
    await demoQAtextboxPage.validate(softExpect,td_fullname,td_email,td_currentAddress,td_permanentAddress);

  })};

