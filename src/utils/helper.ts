import { predictColumns } from "./headerPredict";
import { mergePredictions } from "./mergePredictions";
import { predictColumnsAI } from "./predictColumnsAI";

export async function getSmartColumnPredictions(
  headers: string[],
  rows: string[][]
) {
  const systemPred = predictColumns(headers, rows);
  const aiPred = await predictColumnsAI(headers, rows);
  const final = mergePredictions(systemPred, aiPred);
  return final;
}

export const formatDate = (
  timestamp: Date | { toDate(): Date } | string | unknown
) => {
  if (!timestamp) return "N/A";
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
      return "N/A";
    }
    return date.toLocaleDateString();
  } catch {
    return "N/A";
  }
};
