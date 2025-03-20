import xlsx from "xlsx";
import { setData } from "../dataStore.js";

function ExcellToJSON(req) {
  // Read file from buffer
  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

  // Get first sheet name
  const sheetName = workbook.SheetNames[0];

  // Convert sheet to JSON
  const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  setData(jsonData);

  return jsonData;
}

export { ExcellToJSON };
