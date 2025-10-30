import { ColumnPrediction } from "@/types";

const SYSTEM_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "agentUid",
  "createdOn",
];

const normalize = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

/** 🔍 Simple fuzzy similarity by keyword presence */
function getHeaderHint(field: string, header: string): number {
  const h = normalize(header);
  const f = normalize(field);

  // synonyms for better matching
  const keywords: Record<string, string[]> = {
    firstName: ["name", "fullname", "contactname", "person"],
    lastName: ["lastname", "surname"],
    email: ["email", "mailid", "mail"],
    phone: ["phone", "mobile", "contactnumber", "phonenumber", "whatsapp"],
    agentUid: ["agent", "owner", "assignedto", "handler"],
    createdOn: ["date", "created", "timestamp", "time", "addedon"],
  };

  const hints = keywords[field] || [];
  if (h.includes(f)) return 0.9;
  if (hints.some((w) => h.includes(w))) return 0.8;
  return 0;
}

/** 📅 Regex boost based on actual data */
function getValuePatternBoost(field: string, values: string[]): number {
  const valid = values.filter((v) => v && v.trim());
  if (!valid.length) return 0;

  switch (field) {
    case "email":
      return valid.some((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ? 0.3 : 0;
    case "phone":
      return valid.some((v) => /^\+?[0-9\-\s()]{7,15}$/.test(v)) ? 0.3 : 0;
    case "createdOn":
      return valid.some(
        (v) =>
          /\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(v) ||
          /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(v)
      )
        ? 0.4
        : 0;
    default:
      return 0;
  }
}

/** 🎯 Main predictor */
export function predictColumns(
  headers: string[],
  sampleData: string[][]
): ColumnPrediction[] {
  return headers.map((header, idx) => {
    const normalized = normalize(header);
    let bestMatch = "";
    let bestScore = 0;

    for (const field of SYSTEM_FIELDS) {
      const headerScore = getHeaderHint(field, normalized);
      const values = sampleData.map((row) => row[idx]);
      const patternBoost = getValuePatternBoost(field, values);

      const score = +(headerScore + patternBoost).toFixed(2);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = field;
      }
    }

    const threshold = 0.65; // minimum to qualify as system field
    const isCustom = bestScore < threshold;

    return {
      originalHeader: header,
      suggestedHeader: isCustom ? `${normalized}` : bestMatch,
      confidence: +bestScore.toFixed(2),
      isCustom,
    };
  });
}
