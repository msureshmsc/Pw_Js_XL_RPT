import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { HerokuAppPage } from '../PageObjectModel/HerokuAppPage';

import { fileURLToPath } from 'url';

import { createRunFolder, getScreenshotName, initializeExcel, appendToExcel } from '../utils/reportUtil.js';


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
    const runDir = createRunFolder();
    const excelPath = path.join(runDir, 'TestExecutionReport.xlsx');

    test.beforeAll(async () => {
        await initializeExcel(excelPath);
    });

    let sno = 1;

    for (const [testCaseName, testSteps] of groupedTestCases.entries()) {
        test(`validate: ${testCaseName}`, async ({ page }) => {
            const herokuAppPage = new HerokuAppPage(page);

            for (const step of testSteps) {
                const component = step.Component?.trim().toUpperCase();
                let status = 'PASS';
                let actualResult = '';
                const methodName = component;
                const screenshotName = getScreenshotName(testCaseName, component, methodName);
                const screenshotPath = path.join(runDir, screenshotName);

                try {
                    switch (component) {
                        case 'NAVIGATETO':
                            await herokuAppPage.goto(step.URL);
                            actualResult = 'Navigated';
                            break;

                        case 'COMPAREPAGE':
                            await herokuAppPage.comparePageScreenshot(step.ActualPageScreenshot, step.ExpectedPageScreenshot);
                            actualResult = 'Page Compared';
                            break;

                        case 'COMPAREFIELD':
                            await herokuAppPage.compareFieldScreenshot(step.FieldName, step.ActualFieldSS, step.ExpectedFieldSS);
                            actualResult = 'Field Compared';
                            break;

                        default:
                            status = 'SKIPPED';
                            actualResult = 'Unknown Component';
                    }

                    await page.screenshot({ path: screenshotPath, fullPage: true });
                } catch (error) {
                    status = 'FAIL';
                    actualResult = error.message;
                    await page.screenshot({ path: screenshotPath, fullPage: true });
                }

                await appendToExcel(excelPath, {
                    sno: sno++,
                    testcasename: testCaseName,
                    component: component,
                    methodname: methodName,
                    expected: step.ExpectedResult || '',
                    actual: actualResult,
                    status,
                    screenshot: screenshotPath
                });
            }
        });
    }
});
