// utils/parseFile.ts
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { ParsedFileType } from "@/types";

/**
 * Parse CSV or Excel file and return structured data
 */
export const parseFile = async (file: File): Promise<ParsedFileType> => {
  const fileExt = file.name.split(".").pop()?.toLowerCase();

  if (!fileExt) throw new Error("File type not recognized");

  if (fileExt === "csv") {
    return parseCSV(file);
  } else if (fileExt === "xlsx" || fileExt === "xls") {
    return parseExcel(file);
  } else {
    throw new Error("Unsupported file type. Please upload CSV or Excel.");
  }
};

// ---------------- CSV ----------------
const parseCSV = (file: File): Promise<ParsedFileType> =>
  new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, any>[];
        resolve({ headers, rows });
      },
      error: (err) => reject(err),
    });
  });

// ---------------- Excel ----------------
const parseExcel = async (file: File): Promise<ParsedFileType> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
  });
  const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
  return { headers, rows: jsonData };
};
