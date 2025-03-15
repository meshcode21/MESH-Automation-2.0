import express from "express";
import multer from "multer";
import xlsx from "xlsx"
import { usersData } from "../dataStore.js";

const fileRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

fileRoute.get("/", (req, res) => {
  res.send("this is action router.");
});

fileRoute.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Read file from buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

    // Get first sheet name
    const sheetName = workbook.SheetNames[0];

    // Convert sheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // usersData = jsonData;

    res.json({ message: "File processed successfully", data: jsonData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing file", error: error.message });
  }
});

export default fileRoute;
