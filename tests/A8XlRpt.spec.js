import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { HerokuAppPage } from '../PageObjectModel/HerokuAppPage.js';
import {
    createRunFolder,
    getScreenshotName,
    initializeExcel,
    appendToExcel
} from '../utils/reportUtil.js';

// setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse CSV
const records = parse(fs.readFileSync(path.join(__dirname, '../testdata/DataHeroku.csv')), {
    columns: true,
    skip_empty_lines: true
});

// Group test cases
const groupedTestCases = new Map();
for (const record of records) {
    if (record.ToExecute?.trim().toUpperCase() === 'YES') {
        if (!groupedTestCases.has(record.testcasename)) {
            groupedTestCases.set(record.testcasename, []);
        }
        groupedTestCases.get(record.testcasename).push(record);
    }
}

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
                const component = step.Component?.trim().toUpperCase() || 'UNKNOWN';
                // const methodName = component;
                const screenshotName = getScreenshotName(testCaseName, component);
                const screenshotPath = path.join(runDir, screenshotName);

                let status = 'PASS';
                let actualResult = '';
                let expectedResult = step.ExpectedResult || '';
                let shouldCapture = true;

                try {
                    switch (component) {
                        case 'NAVIGATETO':
                            await herokuAppPage.goto(step.URL);
                            actualResult = `Navigated to ${step.URL}`;
                            break;

                        case 'COMPAREPAGE':
                            await herokuAppPage.comparePageScreenshot(step.ActualPageScreenshot, step.ExpectedPageScreenshot);
                            actualResult = 'Page Screenshot Compared';
                            expectedResult = `Expected: ${step.ExpectedPageScreenshot}`;
                            break;

                        case 'COMPAREFIELD':
                            await herokuAppPage.compareFieldScreenshot(
                                step.FieldName,
                                step.ActualFieldSS,
                                step.ExpectedFieldSS
                            );
                            actualResult = `Field ${step.FieldName} Compared`;
                            expectedResult = `Expected: ${step.ExpectedFieldSS}`;
                            break;

                        default:
                            status = 'SKIPPED';
                            actualResult = 'Unknown Component';
                            shouldCapture = false;
                    }

                    if (shouldCapture) {
                        await page.screenshot({ path: screenshotPath, fullPage: true });
                    }

                } catch (error) {
                    status = 'FAIL';
                    actualResult = `Error: ${error.message}`;
                    await page.screenshot({ path: screenshotPath, fullPage: true });
                }

                // Always write to Excel if it's a known component
                if (component !== 'UNKNOWN') {
                    console.log(`component name = ${component}. Writing to excel`)
                    await appendToExcel(excelPath, {
                        sno: sno++,
                        testcasename: testCaseName,
                        component,
                        // methodname: methodName,
                        expected: expectedResult,
                        actual: actualResult,
                        status,
                        screenshot: shouldCapture ? screenshotPath : ''
                    });
                }
            }
        });
    }
});
