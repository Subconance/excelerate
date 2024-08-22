const XLSX = require("xlsx");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const asyncErrorWrapper = require("express-async-handler");

const excelToJson = asyncErrorWrapper(async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ success: false, error: "File not uploaded." });
  }

  try {
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, error: "File could not be read." });
  }
});

const jsonToExcel = asyncErrorWrapper(async (req, res) => {
  const data = req.body;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  if (data.length > 0) {
    const columns = Object.keys(data[0]).map((key) => ({ header: key, key }));
    worksheet.columns = columns;
    worksheet.addRows(data);
  }

  const filePath = path.join(__dirname, "output.xlsx");

  workbook.xlsx
    .writeFile(filePath)
    .then(() => {
      return res.download(filePath, "output.xlsx", (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ success: false, error: "Failed to download file." });
        }

        fs.unlinkSync(filePath);
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ success: false, error: "Failed to write file." });
    });
});

const convert = asyncErrorWrapper(async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ success: false, error: "File not uploaded." });
  }

  try {
    const jsonData = JSON.parse(fs.readFileSync(file.path, "utf8"));

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const excelFilePath = path.join(__dirname, "output.xlsx");
    XLSX.writeFile(wb, excelFilePath);

    return res.download(excelFilePath, "output.xlsx", (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ success: false, error: "Failed to download file." });
      }


      fs.unlinkSync(excelFilePath);
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, error: "An error occurred while processing the file." });
  } finally {

    fs.unlinkSync(file.path);
  }
});

module.exports = { excelToJson, jsonToExcel, convert };
