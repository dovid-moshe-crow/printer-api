const express = require("express");
const app = express();
const os = require("os");
const fs = require("fs");
const multer = require("multer");
const printer = require("pdf-to-printer");
const { randomUUID } = require("crypto");

const { print } = printer;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${os.tmpdir()}/`);
  },
  filename: function (req, file, cb) {
    cb(null, randomUUID() + ".pdf");
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/print/:name", upload.single("file"), async (req, res) => {
  console.log(req.file);
  print(req.file.path, { printer: req.params.name }).then(() => {
    fs.rmSync(req.file.path);
  });
  return res.status(200).json("ok");
});

app.listen(8383, () => {
  console.log(`Server started on port 8383`);
});
