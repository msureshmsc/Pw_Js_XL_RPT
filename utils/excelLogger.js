// utils/excelLogger.js
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

const reportDir = path.resolve('TestReports');
if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);

const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
const reportFilePath = path.join(reportDir, `TestExecutionReport_${timestamp}.xlsx`);

const headers = ['S.No', 'TestCaseName', 'Component', 'Status', 'ErrorMessage', 'ScreenshotPath'];

let rowCounter = 1;

const initializeWorkbook = async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Test Results');
  sheet.addRow(headers);
  await workbook.xlsx.writeFile(reportFilePath);
};

const logToExcel = async (testCaseName, component, status, errorMessage = '', screenshotPath = '') => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(reportFilePath);
  const sheet = workbook.getWorksheet('Test Results');
  rowCounter++;
  sheet.addRow([rowCounter - 1, testCaseName, component, status, errorMessage, screenshotPath]);
  await workbook.xlsx.writeFile(reportFilePath);
};

export { initializeWorkbook, logToExcel, reportFilePath };
