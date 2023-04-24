const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/"});
const {PowerShell} = require("node-powershell")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// .arg(format!(
//     "Get-Content -Path \"{}\" |  Out-Printer -Name \"{}\"",
//     temp_path.clone().display(), "Microsoft Print to PDF"
// )).spawn();

app.post("/print", upload.single("file"),async (req,res) => {
    console.log(req.file)
    console.log(await PowerShell.$`Get-Content -Path ${req.file.path} | Out-Printer -Name ${"Microsoft Print to PDF"}`)
    return res.status(200).json("hi")
});


app.listen(5000, () => {
    console.log(`Server started...`);
});