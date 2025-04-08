import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { DemoQAtextboxPage } from '../PageObjectModel/DemoQAtextboxPage';

import { fileURLToPath } from 'url';

// Define `__dirname` manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groupedTestCases = new Map();

// Read CSV file
const records = parse(fs.readFileSync(path.join(__dirname, '../testdata/overall.csv')), {
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
test.describe('Dynamic Test Cases from CSV', () => {
    for (const [testCaseName, testSteps] of groupedTestCases.entries()) {
        test(`validate: ${testCaseName}`, async ({ page }) => {
            console.log(`Executing Test Case: ${testCaseName}`);

            const demoQAtextboxPage = new DemoQAtextboxPage(page);

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
                        await demoQAtextboxPage.goto(xlURL);
                        break;
                }
            }
        });
    }
});
