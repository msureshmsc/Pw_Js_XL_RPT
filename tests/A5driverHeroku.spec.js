import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { HerokuAppPage } from '../PageObjectModel/HerokuAppPage';

import { fileURLToPath } from 'url';

// Define `__dirname` manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groupedTestCases = new Map();

// Read CSV file
const records = parse(fs.readFileSync(path.join(__dirname, '../testdata/DataHeroku.csv')), {
    columns: true,
    skip_empty_lines: true
});

// Group test cases by test case name
for (const record of records) {
    if (record.ToExecute === "YES") {
        if (!groupedTestCases.has(record.testcasename)) {
            groupedTestCases.set(record.testcasename, []);
            console.log(`Adding Test case: ${record.testcasename}`);
        }
        groupedTestCases.get(record.testcasename).push(record);
    }
}

// Register tests in a synchronous manner
test.describe('Heroku Validations', () => {
    for (const [testCaseName, testSteps] of groupedTestCases.entries()) {
        test(`validate: ${testCaseName}`, async ({ page }) => {
            console.log(`Executing Test Case: ${testCaseName}`);

            const herokuAppPage = new HerokuAppPage(page);

            for (const step of testSteps) {
                console.log(`Executing Component: ${step.Component}`);

                if (!step.Component) {
                    console.warn(`Skipping undefined component for Test Case: ${testCaseName}`);
                    continue; // Skip if component is undefined
                }

                switch (step.Component?.trim().toUpperCase()) {
                    case 'NAVIGATETO':
                        console.log(`Inside - Executing ${step.Component}`);
                        const xlURL = step.URL;                 	
                        await herokuAppPage.goto(xlURL);
                        await page.waitForTimeout(2000);
                        break;
                    
                    case 'COMPAREPAGE':
                        console.log(`Inside - Executing ${step.Component}`);
                        const expectedPage = step.ExpectedPageScreenshot;
                        const actualPage = step.ActualPageScreenshot;                        	
                        await herokuAppPage.comparePageScreenshot(actualPage,expectedPage);
                        await page.waitForTimeout(2000);
                        break;

                    case 'COMPAREFIELD':
                        console.log(`Inside - Executing ${step.Component}`);
                        const ExpectedFieldSS = step.ExpectedFieldSS;
                        const ActualFieldSS = step.ActualFieldSS;      
                        const FieldName = step.FieldName;                  	
                        await herokuAppPage.compareFieldScreenshot(FieldName,ActualFieldSS,ExpectedFieldSS);
                        await page.waitForTimeout(2000);
                        break;                                        
                }
            }
        });
    }
});
