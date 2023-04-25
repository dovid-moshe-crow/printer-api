import express from "express";
const app = express();
import os from "os";
import fs from "fs";
import multer from "multer";
import printer from "pdf-to-printer";
import { randomUUID } from "crypto";

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
