import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

export const createRunFolder = () => {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const runDir = path.join('./reports', `Run_${timestamp}`);
    fs.mkdirSync(runDir, { recursive: true });
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Create Run Folder>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    return runDir;
};

export const getScreenshotName = (testCaseName, component) => {
    const tc = (testCaseName || '').substring(0, 5).padEnd(5, '_');
    const comp = (component || '').substring(0, 5).padEnd(5, '_');
    // const method = (methodName || '').substring(0, 5).padEnd(5, '_');
    return `${tc}_${comp}.png`;
};

export const initializeExcel = async (excelPath) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Test Results');

    sheet.columns = [
        { header: 'Sno', key: 'sno', width: 5 },
        { header: 'TestCaseName', key: 'testcasename', width: 30 },
        { header: 'Componont', key: 'component', width: 20 },
        // // { header: 'POMMethodName', key: 'methodname', width: 20 },
        // { header: 'ExpectedResult', key: 'expected', width: 30 },
        // { header: 'ActualResult', key: 'actual', width: 30 },
        { header: 'StepStatus', key: 'status', width: 15 },
        { header: 'ScreenshotNameWithFilePath', key: 'screenshot', width: 50 }
    ];
    await workbook.xlsx.writeFile(excelPath);
    console.log(`<<<<<<<<<<<<<<<<<<<<<Create excel file- ${excelPath}>>>>>>>>>>>>>>>>>>>>>>`);
};

export const appendToExcel = async (excelPath, rowData) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const sheet = workbook.getWorksheet('Test Results');
    sheet.addRow(rowData);
    console.log(`Row Data: ${rowData}`);
    await workbook.xlsx.writeFile(excelPath);
};
