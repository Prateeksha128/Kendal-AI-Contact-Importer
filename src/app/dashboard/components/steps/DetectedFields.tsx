"use client";

import { useFileContext } from "@/contexts/FileContext";
import { useMemo, useEffect } from "react";
import { Link2, Search, Target, Wrench } from "lucide-react";

export default function DetectedFields() {
  const { fileData } = useFileContext();
  const { headers = [], rows = [], predictions = [] } = fileData || {};

  // Derive summary stats
  const { total, highConfidence, customFields } = useMemo(() => {
    const total = predictions?.length || 0;
    const highConfidence =
      predictions?.filter((p) => p.confidence >= 0.8).length || 0;
    const customFields = predictions?.filter((p) => p.isCustom).length || 0;
    return { total, highConfidence, customFields };
  }, [predictions]);

  // Extract up to 5 sample rows
  const sampleRows = rows.slice(0, 5);

  // Validation function for step 1 - always valid as it's just displaying detected fields
  useEffect(() => {
    type ValidationResult = {
      isValid: boolean;
      unmappedFields: Array<{ label: string }>;
    };
    type WindowWithValidation = Window & {
      validateDetectedFields?: () => ValidationResult;
    };

    const validateDetectedFields = (): ValidationResult => {
      // Step 1 always passes validation (just reviewing detected fields)
      return {
        isValid: true,
        unmappedFields: [],
      };
    };

    (window as WindowWithValidation).validateDetectedFields =
      validateDetectedFields;

    return () => {
      delete (window as WindowWithValidation).validateDetectedFields;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h3 className="text-[18px] font-semibold text-[#0E4259]">
          Column Detection Results
        </h3>
        <p className="text-[#68818C] text-[16px]">
          Our intelligent mapping has mapped {total} fields in this entry with
          the CRM Contact Fields
        </p>
      </div>

      {/* Summary badges */}
      <div className="flex gap-4 flex-wrap justify-center w-full">
        <div className="px-4 py-2 bg-[#E7FFEA] justify-center text-[#087025] flex-1 w-full rounded-sm font-medium flex items-center gap-2">
          <Search className="w-4 h-4" />
          {total} Fields Detected
        </div>
        <div className="px-4 py-2 bg-[#F6F6FF] justify-center flex-1 w-full text-[#5740DF] rounded-sm font-medium flex items-center gap-2">
          <Target className="w-4 h-4" />
          {highConfidence} High Confidence
        </div>
        <div className="px-4 py-2 bg-[#FFF1FC] justify-center flex-1 w-full text-[#B71897] rounded-sm font-medium flex items-center gap-2">
          <Wrench className="w-4 h-4" />
          {customFields} Custom Fields
        </div>
      </div>

      {/* Field mappings list */}
      <div className="flex flex-col gap-4 mt-4">
        {predictions?.map((p, index) => {
          const conf = Math.min(Math.round(p.confidence * 100), 100);
          const confidenceColor =
            conf >= 80
              ? "bg-green-100 text-green-700"
              : conf < 30
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700";

          // Collect sample values from up to 5 rows
          const samples = sampleRows.map((r) => {
            const val = r[index];
            if (!val) return "—";
            return val.length > 20 ? val.slice(0, 20) + "…" : val;
          });

          return (
            <div
              key={index}
              className="flex flex-col p-4 border rounded-lg bg-[#FDFDFD]"
            >
              {/* Top section: field + mapping */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-3 w-full">
                {/* Original field */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-sm rounded-md font-medium ${confidenceColor}`}
                  >
                    {conf}%
                  </span>
                  <p className="font-semibold text-[#0E4259]">
                    {p.originalHeader}
                  </p>
                </div>

                {/* Suggested field */}
                <div className="flex items-center gap-3 mt-2 md:mt-0 w-full md:w-auto">
                  <Link2 className="text-[#1970F3] w-4 h-4" />
                  <p
                    className={`text-[16px] font-medium truncate ${
                      p.isCustom ? "text-pink-600" : "text-[#0056D2]"
                    }`}
                  >
                    {p.suggestedHeader}
                  </p>
                </div>
              </div>

              {/* Sample chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {samples.map((sample, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                  >
                    {sample}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
