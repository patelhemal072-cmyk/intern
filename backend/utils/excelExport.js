const xlsx = require('xlsx');
const Form = require('../models/Form');
const fs = require('fs');
const path = require('path');

// Function to export form data to Excel (Buffer for download)
const exportToExcel = async () => {
  try {
    const formData = await Form.find({}).sort({ submittedAt: -1 });

    const excelData = formData.map(item => ({
      'Full Name': item.fullName,
      'Email': item.email,
      'Phone': item.phone,
      'Package': item.package,
      'Message': item.message || ''
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(excelData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Applications');

    return xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  } catch (error) {
    throw new Error(`Error exporting to Excel: ${error.message}`);
  }
};

// Function to append new submission to a local Excel file
const appendToExcel = async (newData) => {
  try {
    const filePath = path.join(__dirname, '../exports/applications.xlsx');
    const exportsDir = path.join(__dirname, '../exports');

    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    let workbook;
    let worksheet;
    const dataToAppend = {
      'Full Name': newData.fullName,
      'Email': newData.email,
      'Phone': newData.phone,
      'Package': newData.package,
      'Message': newData.message || ''
    };

    if (fs.existsSync(filePath)) {
      workbook = xlsx.readFile(filePath);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const existingData = xlsx.utils.sheet_to_json(worksheet);
      existingData.push(dataToAppend);
      worksheet = xlsx.utils.json_to_sheet(existingData);
      workbook.Sheets[workbook.SheetNames[0]] = worksheet;
    } else {
      workbook = xlsx.utils.book_new();
      worksheet = xlsx.utils.json_to_sheet([dataToAppend]);
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Applications');
    }

    xlsx.writeFile(workbook, filePath);
    console.log('Excel file updated successfully');
  } catch (error) {
    console.error('Error updating Excel file:', error);
  }
};

module.exports = { exportToExcel, appendToExcel };
