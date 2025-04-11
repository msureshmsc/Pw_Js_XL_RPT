// A9XlRpt.spec.js
import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { HerokuAppPage } from '../PageObjectModel/HerokuAppPage.js';
import { logToExcel, initializeWorkbook, reportFilePath } from '../utils/excelLogger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groupedTestCases = new Map();
const records = parse(fs.readFileSync(path.join(__dirname, '../testdata/DataHeroku.csv')), {
    columns: true,
    skip_empty_lines: true
});

for (const record of records) {
    if (record.ToExecute === "YES") {
        if (!groupedTestCases.has(record.testcasename)) {
            groupedTestCases.set(record.testcasename, []);
        }
        groupedTestCases.get(record.testcasename).push(record);
    }
}

await initializeWorkbook();

test.describe('Heroku Validations', () => {
    for (const [testCaseName, testSteps] of groupedTestCases.entries()) {
        test(`validate: ${testCaseName}`, async ({ page }) => {
            const herokuAppPage = new HerokuAppPage(page);

            for (const step of testSteps) {
                const component = step.Component?.trim().toUpperCase();
                if (!component) continue;

                try {
                    switch (component) {
                        case 'NAVIGATETO':
                            await herokuAppPage.goto(step.URL);
                            break;

                        case 'COMPAREPAGE':
                            await herokuAppPage.comparePageScreenshot(step.ActualPageScreenshot, step.ExpectedPageScreenshot);
                            break;

                        case 'COMPAREFIELD':
                            await herokuAppPage.compareFieldScreenshot(step.FieldName, step.ActualFieldSS, step.ExpectedFieldSS);
                            break;
                    }

                    await logToExcel(testCaseName, component, 'PASS');

                } catch (error) {
                    const errorSSDir = path.resolve('errorScreenshots');
                    if (!fs.existsSync(errorSSDir)) fs.mkdirSync(errorSSDir);
                    const screenshotPath = path.join('errorScreenshots', `${testCaseName}_${component}.png`);
                    await page.screenshot({ path: screenshotPath, fullPage: true });
                    await logToExcel(testCaseName, component, 'FAIL', error.message, screenshotPath);
                }

                await page.waitForTimeout(2000);
            }
        });
    }
});
