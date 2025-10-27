import { ColumnPrediction } from "@/types";

/**
 * Merge predictions: whichever has higher confidence wins.
 */
export function mergePredictions(
  sys: ColumnPrediction[],
  ai: ColumnPrediction[]
): ColumnPrediction[] {
  return sys.map((sysItem) => {
    const aiItem = ai.find(
      (a) =>
        a.originalHeader.toLowerCase() === sysItem.originalHeader.toLowerCase()
    );

    if (!aiItem) return sysItem;

    // Decide based on confidence
    if (aiItem.confidence > sysItem.confidence) {
      return { ...aiItem, source: "ai" };
    } else {
      return { ...sysItem, source: "system" };
    }
  });
}
