const express = require("express");
const upload = require("../helpers/multer");
const { excelToJson, jsonToExcel, convert } = require("../controllers");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Excelarate API",
  });
});

router.post("/upload", upload.single("file"), excelToJson);
router.post("/write", jsonToExcel);
router.post("/convert", upload.single("file"), convert);

module.exports = router;
