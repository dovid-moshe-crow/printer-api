const express = require("express");
const app = express();
const os = require('os');
const multer = require("multer");

const { PowerShell } = require("node-powershell");
const { randomUUID } = require("crypto");

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

// .arg(format!(
//     "Get-Content -Path \"{}\" |  Out-Printer -Name \"{}\"",
//     temp_path.clone().display(), "Microsoft Print to PDF"
// )).spawn();

app.post("/print", upload.single("file"), async (req, res) => {
  console.log(req.file);
  console.log(
    await PowerShell.$`Get-Content -Path ${
      req.file.path
    } | Out-Printer -Name ${"Microsoft Print to PDF"}`
  );
  return res.status(200).json("hi");
});

app.listen(5000, () => {
  console.log(`Server started...`);
});
