"use client";

import { useState, useEffect } from "react";
import { Check, X, Plus, AlertCircle, Trash2 } from "lucide-react";
import { createCustomContactField, getAllContactFields } from "@/utils/helper";
import { ContactField } from "@/types";
import toast from "react-hot-toast";
import { deleteDocument } from "@/lib/firestore";

interface ContactFieldDropdownProps {
  value?: string;
  onSelect: (fieldId: string, isCustom: boolean) => void;
  disabledCoreField?: boolean;
  selectedValues?: string[];
}

export default function ContactFieldDropdown({
  value,
  onSelect,
  disabledCoreField = false,
  selectedValues = [],
}: ContactFieldDropdownProps) {
  const [fields, setFields] = useState<ContactField[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [error, setError] = useState("");

  // Fetch all fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const data = await getAllContactFields();
        setFields(data as ContactField[]);
      } catch (err) {
        console.error("Error fetching fields:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  const handleSelect = (fieldId: string, isCustom: boolean) => {
    if (fieldId === "skip" && disabledCoreField) {
      setError("Core fields cannot be skipped");
      setOpen(false);
      return;
    }
    onSelect(fieldId, isCustom);
    setError("");
    setOpen(false);
  };

  const handleCreateCustomField = async () => {
    if (!newFieldName.trim()) return;

    // Prevent duplicate key/label
    const isDuplicate = fields.some(
      (f) => f.label.trim().toLowerCase() === newFieldName.trim().toLowerCase()
    );
    if (isDuplicate) {
      setOpen(false);
      setError("A field with that name already exists.");
      return;
    }
    try {
      setError("");
      setCreating(true);
      const res = await createCustomContactField(newFieldName);

      if (res.success && res.data?.id) {
        const newField: ContactField = {
          id: res.data.id,
          label: newFieldName.trim(),
          type: "text",
          core: false,
        };

        setFields((prev) => [...prev, newField]);
        onSelect(res.data.label as string, true);
        setNewFieldName("");
        setOpen(false);
      } else {
        setError(res.error || "Failed to create field");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while creating field");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteContactField = async (fieldId: string) => {
    try {
      const res = await deleteDocument("contactFields", fieldId);
      if (res.success) {
        setFields((prev) => prev.filter((f) => f.id !== fieldId));
        toast.success("Field deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete field");
      }
    } catch (err) {
      console.error("Error deleting field:", err);
      toast.error("Something went wrong while deleting field");
    }
  };

  const coreFields = fields.filter((f) => f.core);
  const crmFields = fields.filter((f) => !f.core);

  return (
    <div className="relative inline-block w-full sm:w-72">
      {/* Selected value */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-left flex items-center justify-between hover:border-gray-400 transition"
      >
        <span className="truncate text-gray-800">
          {value
            ? fields.find((f) => f.id === value)?.label || value
            : "Select field"}
        </span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              Loading fields...
            </div>
          ) : (
            <>
              {/* Don't import option */}
              <div
                onClick={() => handleSelect("skip", false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              >
                <span>🚫 Don&apos;t import this field</span>
                {value === "skip" && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </div>

              {/* Create custom field */}
              {!creating ? (
                <div
                  onClick={() => setCreating(true)}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 cursor-pointer flex items-center gap-2 border-b border-gray-100"
                >
                  <Plus className="w-4 h-4" />
                  Create Custom Field
                </div>
              ) : (
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-[#0E4259] ">
                  <input
                    type="text"
                    placeholder="Custom field name"
                    className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                  />
                  <button
                    onClick={handleCreateCustomField}
                    className="px-2 py-1 bg-blue-600 text-white rounded-md text-sm"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setCreating(false)}
                    className="text-gray-400 hover:text-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Core fields */}
              {coreFields.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-blue-100 text-xs font-semibold text-gray-500 uppercase">
                    Core Fields
                  </div>
                  {coreFields.map((f) => {
                    const isTaken =
                      selectedValues?.includes(f.label) && value !== f.label;
                    return (
                      <div
                        key={f.id}
                        onClick={() => {
                          if (!isTaken) handleSelect(f.label, false);
                        }}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 flex items-center justify-between ${
                          value === f.label ? "bg-blue-50" : ""
                        } ${isTaken ? "opacity-60 cursor-not-allowed" : ""}`}
                        style={isTaken ? { pointerEvents: "none" } : {}}
                      >
                        <span
                          className={`flex items-center gap-2 text-[16px] font-medium ${
                            value === f.label
                              ? "text-green-600"
                              : "text-gray-700"
                          }`}
                        >
                          {f.label}
                          {value === f.label && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </span>
                        <Trash2 className="w-4 h-4 text-gray-200 cursor-not-allowed" />
                      </div>
                    );
                  })}
                </>
              )}

              {/* CRM fields */}
              {crmFields.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-blue-100 text-xs font-semibold text-gray-500 uppercase">
                    CRM Fields
                  </div>
                  {crmFields.map((f) => {
                    const isTaken =
                      selectedValues?.includes(f.label) && value !== f.label;
                    return (
                      <div
                        key={f.id}
                        onClick={() => {
                          if (!isTaken) handleSelect(f.label, true);
                        }}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-700 ${
                          value === f.label ? "bg-blue-50" : ""
                        } ${isTaken ? "opacity-60 cursor-not-allowed" : ""}`}
                        style={isTaken ? { pointerEvents: "none" } : {}}
                      >
                        <div className="flex items-center gap-2">
                          <span>{f.label}</span>
                          {value === f.label && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <Trash2
                          className="w-4 h-4 text-[#D74141]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContactField(f.id);
                          }}
                        />
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
