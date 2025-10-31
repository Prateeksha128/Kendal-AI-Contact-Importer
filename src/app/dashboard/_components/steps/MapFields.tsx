"use client";

import { useEffect, useState, useMemo } from "react";
import { Link2, Edit2, AlertCircle } from "lucide-react";
import { useFileContext } from "@/contexts/FileContext";
import { CONTACT_FIELDS } from "@/constant";
import ContactFieldDropdown from "./Dropdown";
import { ParsedFileData } from "@/types";
import { getAllContactFields } from "@/utils/helper";
import { ContactField } from "@/types";

export default function MapFields() {
  const { fileData, setFileData } = useFileContext();
  const { predictions = [], rows = [] } = fileData || {};

  const samples = rows.slice(0, 5);
  const [allFields, setAllFields] = useState<ContactField[]>([]);

  // Fetch all fields from database
  useEffect(() => {
    const fetchFields = async () => {
      const fields = await getAllContactFields();
      setAllFields(fields as ContactField[]);
    };
    fetchFields();
  }, []);

  const predefinedFields = CONTACT_FIELDS.map((f) => ({
    label: f.label,
    value: f.id,
    core: f.core,
  }));

  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [mapping, setMapping] = useState(predictions);
  const selectedValues = mapping.map((m) => m.suggestedHeader).filter(Boolean);
  // ✅ Handle dropdown change
  const handleSelect = (index: number, field: string, isCustom: boolean) => {
    // Build the updated predictions array synchronously
    const updated = [...mapping];
    const target = updated[index];
    updated[index] = {
      ...target,
      suggestedHeader: field === "skip" ? "" : field,
      isCustom,
    };

    // Update local state and the shared context with the same updated array
    setMapping(updated);
    setFileData({ ...fileData!, predictions: updated } as ParsedFileData);
    setEditableIndex(null);
  };

  // ✅ Validation for unmapped core fields (include predefinedFields in dependencies)
  const validateMappedCoreFields = useMemo(() => {
    // Exclude 'createdOn' from required core fields
    const coreFields = predefinedFields.filter(
      (f) => f.core && f.label !== "createdOn"
    );

    const mappedHeaders = mapping.map((m) => m.suggestedHeader?.toLowerCase());
    const unmapped = coreFields.filter(
      (f) => !mappedHeaders.includes(f.value.toLowerCase())
    );

    return {
      isValid: unmapped.length === 0,
      unmappedFields: unmapped,
    };
  }, [mapping, predefinedFields]);

  // ✅ Expose validation globally (for parent), type safe
  useEffect(() => {
    (
      window as unknown as {
        validateMapFields?: () => typeof validateMappedCoreFields;
      }
    ).validateMapFields = () => validateMappedCoreFields;
    return () => {
      delete (
        window as unknown as {
          validateMapFields?: () => typeof validateMappedCoreFields;
        }
      ).validateMapFields;
    };
  }, [validateMappedCoreFields]);

  // ✅ Helper to get confidence badge color
  const getBadgeColor = (conf: number) => {
    if (conf >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (conf < 30) return "bg-red-100 text-red-700 border-red-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <header>
        <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#0E4259]">
          Smart Field Mapping
        </h3>
        <p className="text-[#68818C] text-[14px] sm:text-[16px]">
          Review and adjust AI-powered field mappings below.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:gap-4">
        {mapping.map((p, index) => {
          const conf = Math.min(Math.round(p.confidence * 100), 100);
          const badgeColor = getBadgeColor(conf);

          const field = allFields.find(
            (f) => f.label?.toLowerCase() === p.suggestedHeader?.toLowerCase()
          );
          const isCoreField = field?.core ?? false;
          const isSystemField = isCoreField;

          return (
            <div
              key={index}
              className={`p-3 sm:p-4 flex flex-col gap-2 rounded-xl border bg-white transition-colors ${
                isSystemField ? "border-gray-200" : "border-[#FFD3D3]"
              }`}
            >
              {/* Top labels */}
              <div className="flex flex-col sm:flex-row sm:justify-between mb-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs px-2 py-1 rounded-md border font-medium bg-[#FBEBFF] text-[#920C7A] border-[#FFB7F4]">
                    DATABASE FIELD
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs px-2 py-1 rounded-md border ${badgeColor}`}
                  >
                    {conf}% •{" "}
                    {conf >= 80 ? "High" : conf < 30 ? "Low" : "Medium"}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs px-2 py-1 rounded-md font-medium bg-[#E7F5FB] border border-[#AACCFF] text-[#0959D1]">
                  CRM FIELD
                </span>
              </div>

              {/* Field mapping section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 w-full">
                <div className="min-w-0">
                  <p className="text-[#0E4259] text-[18px] sm:text-[20px] font-semibold truncate">
                    {p.originalHeader}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2 md:mt-0 w-full md:w-auto">
                  <Link2 className="text-[#1970F3]" />
                  {editableIndex === index ? (
                    <div className="w-full sm:w-auto">
                      <ContactFieldDropdown
                        value={p.suggestedHeader}
                        onSelect={(val: string, isCustom: boolean) =>
                          handleSelect(index, val, isCustom)
                        }
                        disabledCoreField={isCoreField}
                        selectedValues={selectedValues}
                      />
                    </div>
                  ) : (
                    <p className="text-[16px] sm:text-[20px] font-medium text-[#0056D2] truncate">
                      {p.suggestedHeader || "—"}
                    </p>
                  )}
                  <button
                    className="sm:ml-2 text-gray-500 hover:text-black self-start sm:self-auto"
                    onClick={() =>
                      setEditableIndex(editableIndex === index ? null : index)
                    }
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <div className="flex flex-wrap gap-1 mt-1 sm:max-w-[700px]">
                  {samples.map((row, i) => {
                    const val = String(row[index] || "");
                    return (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                      >
                        {val.length > 20 ? val.slice(0, 20) + "…" : val}
                      </span>
                    );
                  })}
                </div>
                <div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border
                        ${
                          isSystemField
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-[#D74141]  border-red-200"
                        }`}
                  >
                    {isSystemField ? "System Field" : "Custom Field"}
                  </span>
                </div>
              </div>

              {(!isSystemField || conf < 50) && (
                <div className="mt-2 sm:mt-4 flex items-center justify-center gap-1 text-[11px] sm:text-[12px] text-[#D74141] font-medium bg-[#FFF2EF] px-2 py-1 rounded-md">
                  <AlertCircle className="w-3 h-3" />
                  Manual Review Recommended
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
