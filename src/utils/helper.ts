import { Timestamp } from "firebase/firestore";
import { predictColumns } from "./headerPredict";
import { mergePredictions } from "./mergePredictions";
import { predictColumnsAI } from "./predictColumnsAI";
import { addDocument, DEFAULT_COMPANY_ID, getDocuments } from "@/lib/firestore";
import { ContactField } from "@/types";

export async function getSmartColumnPredictions(
  headers: string[],
  rows: string[][]
) {
  const systemPred = await predictColumns(headers, rows);
  const aiPred = await predictColumnsAI(headers, rows);
  const final = mergePredictions(systemPred, aiPred);
  return final;
}

export const formatDate = (
  timestamp: Date | { toDate(): Date } | string | unknown
) => {
  if (!timestamp) return "-----";
  try {
    let date: Date;
    if (
      typeof timestamp === "object" &&
      timestamp !== null &&
      "toDate" in timestamp
    ) {
      date = (timestamp as { toDate(): Date }).toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === "string" || typeof timestamp === "number") {
      date = new Date(timestamp);
    } else {
      return "-----";
    }
    if (isNaN(date.getTime())) return "-----";
    return date.toLocaleDateString();
  } catch {
    return "-----";
  }
};

// Display helper for null/undefined/empty
export function displayValue(value: unknown): string {
  if (value === null || value === undefined) return "-----";
  if (typeof value === "string" && value.trim() === "") return "-----";
  return String(value);
}

// Fetch core fields from /contactFields database
export async function getCoreFields(): Promise<ContactField[]> {
  try {
    const response = await getDocuments<ContactField>("contactFields");
    if (response.success && response.data) {
      return response.data.filter((field) => field.core === true);
    }
    return [];
  } catch (error) {
    console.error("Error fetching core fields:", error);
    return [];
  }
}

export async function getAllContactFields() {
  const res = await getDocuments("contactFields");
  if (res.success) return res.data || [];
  return [];
}

// Map field keys to display labels
export function getFieldDisplayLabel(
  fieldKey: string,
  coreFields: ContactField[]
): string {
  const field = coreFields.find((f) => f.id === fieldKey);
  return field ? field.label : fieldKey;
}

// Add a new custom contact field
export async function createCustomContactField(
  name: string,
  companyId: string = DEFAULT_COMPANY_ID
) {
  if (!name.trim()) {
    return { success: false, error: "Name is required" };
  }

  const newField = {
    label: name.trim(),
    type: "text" as const,
    core: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  return await addDocument("contactFields", newField, companyId);
}
