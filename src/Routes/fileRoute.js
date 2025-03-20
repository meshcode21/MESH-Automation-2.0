import express from "express";
import multer from "multer";
import { ExcellToJSON } from "../utils/ExcellConverter.js";


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

    res.json({ message: "File processed successfully", data: jsonData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing file", error: error.message });
  }
});

fileRoute.get("/downloadResult",(req,res)=>{

});

export default fileRoute;
