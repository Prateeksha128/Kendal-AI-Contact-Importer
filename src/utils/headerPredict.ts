import { ColumnPrediction } from "@/types";
import { getDocuments } from "@/lib/firestore";

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

/** 🎯 Check if header exactly matches a CRM field from database */
async function checkExactCRMFieldMatch(header: string): Promise<string | null> {
  try {
    const crmFieldsRes = await getDocuments("contactFields");
    const crmFields = crmFieldsRes.success ? crmFieldsRes.data || [] : [];
    const normalizedHeader = normalize(header);

    for (const field of crmFields) {
      const fieldLabel = (field as { label: string }).label;
      if (normalizedHeader === normalize(fieldLabel)) {
        return fieldLabel;
      }
    }
    return null;
  } catch (err) {
    console.warn("Error checking CRM fields:", err);
    return null;
  }
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
export async function predictColumns(
  headers: string[],
  sampleData: string[][]
): Promise<ColumnPrediction[]> {
  const results = await Promise.all(
    headers.map(async (header, idx) => {
      // First check if header exactly matches a CRM field
      const exactMatch = await checkExactCRMFieldMatch(header);
      if (exactMatch) {
        return {
          originalHeader: header,
          suggestedHeader: exactMatch,
          confidence: 1.0,
          isCustom: false,
        };
      }

      // Otherwise, use existing fuzzy matching logic
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
    })
  );

  return results;
}
