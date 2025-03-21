import express from "express";
import multer from "multer";
import { ExcellToJSON } from "../utils/ExcellConverter.js";
import { getResult, setData } from "../data/dataProvider.js";
import xlsx from "xlsx";


const fileRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

fileRoute.get("/", (req, res) => {
  res.send("this is file router.");
});

fileRoute.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const jsonData = ExcellToJSON(req);

    setData(jsonData);

    res.json({ message: "File processed successfully", data: jsonData });

  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing file", error: error.message });
  }
});

fileRoute.get("/downloadResult",(req,res)=>{
  const results = getResult();

  console.log(results);
  

  // Convert extracted data to Excel when all files are processed
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(results);
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Details');

  const excelFilePath = "result.xlsx";
  xlsx.writeFile(workbook, excelFilePath);
  
  res.download(excelFilePath, (err) => {
    if (err) console.error('Error downloading file:', err); 
  });
});
 
export default fileRoute;
