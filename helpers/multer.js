const multer = require("multer");
const fs = require("fs");
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

module.exports = upload;
