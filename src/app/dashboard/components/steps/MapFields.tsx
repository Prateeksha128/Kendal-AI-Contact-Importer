"use client";

import { useEffect, useState, useMemo } from "react";
import { Link2, Edit2, AlertCircle } from "lucide-react";
import { useFileContext } from "@/contexts/FileContext";
import { CONTACT_FIELDS } from "@/constant";
import ContactFieldDropdown from "./Dropdown";

export default function MapFields() {
  const { fileData } = useFileContext();
  const { predictions = [], rows = [] } = fileData || {};
  const samples = rows.slice(0, 5);

  const predefinedFields = CONTACT_FIELDS.map((f) => ({
    label: f.label,
    value: f.id,
    core: f.core,
  }));

  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [mapping, setMapping] = useState(predictions);

  // ✅ Handle dropdown selection
  const handleSelect = (index: number, newField: string) => {
    const updated = [...mapping];

    if (newField === "skip") {
      // Clear mapping for this field
      updated[index].suggestedHeader = "";
      updated[index].isCustom = false;
    } else if (newField === "custom") {
      updated[index].suggestedHeader = "custom";
      updated[index].isCustom = true;
    } else {
      updated[index].suggestedHeader = newField;
      updated[index].isCustom = false;
    }

    setMapping(updated);
    setEditableIndex(null);
  };

  // ✅ Validation for unmapped core fields
  const validateMappedCoreFields = useMemo(() => {
    return () => {
      const coreFields = predefinedFields.filter((f) => f.core);
      const mappedHeaders = mapping.map((m) =>
        m.suggestedHeader?.toLowerCase()
      );

      const unmappedCoreFields = coreFields.filter(
        (f) =>
          !mappedHeaders.includes(f.label.toLowerCase()) &&
          !mappedHeaders.includes(f.value.toLowerCase())
      );

      return {
        isValid: unmappedCoreFields.length === 0,
        unmappedFields: unmappedCoreFields,
      };
    };
  }, [mapping, predefinedFields]);

  useEffect(() => {
    (
      window as unknown as {
        validateMapFields: () => {
          isValid: boolean;
          unmappedFields: unknown[];
        };
      }
    ).validateMapFields = validateMappedCoreFields;
    return () => {
      delete (
        window as unknown as {
          validateMapFields?: () => {
            isValid: boolean;
            unmappedFields: unknown[];
          };
        }
      ).validateMapFields;
    };
  }, [validateMappedCoreFields]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h3 className="text-[18px] font-semibold text-[#0E4259]">
          Smart Field Mapping
        </h3>
        <p className="text-[#68818C] text-[16px]">
          Review and adjust the AI-powered field mappings below. Click “Edit”
          next to any mapping to change it. You can map to existing CRM fields
          or create custom fields.
        </p>
      </div>

      {/* Mapping List */}
      <div className="flex flex-col gap-4">
        {mapping.map((p, index) => {
          const conf = Math.min(Math.round(p.confidence * 100), 100);
          let badgeColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
          if (conf >= 80)
            badgeColor = "bg-green-100 text-green-700 border-green-200";
          else if (conf < 30)
            badgeColor = "bg-red-100 text-red-700 border-red-200";

          const currentField = predefinedFields.find(
            (f) =>
              f.label?.toLowerCase() === p.suggestedHeader?.toLowerCase() ||
              ("value" in f &&
                f.value?.toLowerCase() === p.suggestedHeader?.toLowerCase())
          );

          const isCoreField = currentField?.core === true;

          return (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-colors ${
                p.isCustom
                  ? "border-pink-300 bg-pink-50/40"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Confidence + Manual Review */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`text-xs px-2 py-1 rounded-md border border-[#FFB7F4] font-medium bg-[#FBEBFF] text-[#920C7A]`}
                  >
                    DATABASE FIELD
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-md ${badgeColor}`}>
                    {conf}% •{" "}
                    {conf >= 80 ? "High" : conf < 30 ? "Low" : "Medium"}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {p.isCustom && (
                    <div className="flex items-center gap-1 text-sm text-pink-700 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      Manual Review Required
                    </div>
                  )}
                  <div className="text-xs px-2 py-1 rounded-md font-medium bg-[#E7F5FB] border border-[#AACCFF] text-[#0959D1]">
                    CRM FIELD
                  </div>
                </div>
              </div>

              {/* Field mapping section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <p className="text-[#0E4259] font-semibold">
                    {p.originalHeader}
                  </p>

                  {/* Sample values */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {samples.map((row, i) => {
                      const value = String(row[index] || "");
                      const display =
                        value.length > 20 ? value.slice(0, 20) + "…" : value;
                      return (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                        >
                          {display}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  <Link2 className="text-[#1970F3]" />

                  {editableIndex === index ? (
                    <ContactFieldDropdown
                      value={p.suggestedHeader}
                      onSelect={(val) => handleSelect(index, val)}
                      disabledCoreField={isCoreField}
                    />
                  ) : (
                    <p
                      className={`text-[16px] font-medium ${
                        p.isCustom ? "text-pink-600" : "text-[#0056D2]"
                      }`}
                    >
                      {p.suggestedHeader || "—"}
                    </p>
                  )}

                  <button
                    className="ml-2 text-gray-500 hover:text-black"
                    onClick={() =>
                      setEditableIndex(editableIndex === index ? null : index)
                    }
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
