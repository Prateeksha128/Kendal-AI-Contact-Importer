import { GoogleGenerativeAI } from "@google/generative-ai";
import { ColumnPrediction } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

/**
 * Safely parse AI JSON response, stripping markdown or extra text
 */
function parseAIJSON(text: string): ColumnPrediction[] {
  // Match ```json ... ``` or just ``` ... ```
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonString = match ? match[1].trim() : text.trim();

  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    console.warn("Failed to parse AI JSON:", err, jsonString);
  }

  return []; // fallback empty
}

/**
 * Use Gemini to semantically predict field mappings
 */
export async function predictColumnsAI(
  headers: string[],
  sampleData: string[][]
): Promise<ColumnPrediction[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
You are a smart CSV column analyzer.
Given a list of headers and sample values, map them to system fields:
firstName, lastName, email, phone, agentUid, createdOn

If the header doesn't match any, mark it as custom.

Return a JSON array of objects:
{ originalHeader, suggestedHeader, confidence (0–1), isCustom }
Only return valid JSON, no explanations.
`;

  const inputExample = {
    headers,
    sampleRows: sampleData.slice(0, 3),
  };

  try {
    const result = await model.generateContent([
      prompt,
      `Input:\n${JSON.stringify(inputExample, null, 2)}`,
    ]);

    const text = result.response.text();
    return parseAIJSON(text);
  } catch (err) {
    console.warn("AI mapping failed, fallback to default:", err);
    return headers.map((h) => ({
      originalHeader: h,
      suggestedHeader: `custom_${h}`,
      confidence: 0,
      isCustom: true,
    }));
  }
}
