"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  DetectedFields,
  MapFields,
  ParsingFile,
  FinalChecksComplete,
  FinalChecksLoading,
} from "./steps";
import { useFileContext } from "@/contexts/FileContext";
import { DEFAULT_COMPANY_ID } from "@/lib/firestore";
import { importContactsBulk } from "@/service/importContacts";
import { ImportSummary } from "@/types";
import { useRouter } from "next/navigation";

const steps = [
  { number: 1, title: "Detect Fields", description: "Review data structure" },
  { number: 2, title: "Map Fields", description: "Connect to CRM Fields" },
  { number: 3, title: "Final Checks", description: "For Duplicates or Errors" },
];

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [importSummary, setImportSummary] = useState<ImportSummary>({
    created: 0,
    merged: 0,
    skipped: 0,
  });
  const router = useRouter();
  const {
    fileData,
    isParsingLoading,
    isCheckingLoading,
    setIsCheckingLoading,
  } = useFileContext();

  // prepare contacts
  const prepareContacts = () => {
    if (!fileData) return [];

    const mapHeader = (header: string) => {
      const match = fileData.predictions.find(
        (p) => p.originalHeader === header
      );
      return match ? match.suggestedHeader : header;
    };

    return fileData.rows
      .map((row: string[]) => {
        const contact: Record<string, string> = {};
        let hasContent = false;

        row.forEach((value, i) => {
          const mappedHeader = mapHeader(fileData.headers[i]);
          // 🚫 Skip columns where user chose "Don't import this field"
          if (!mappedHeader || mappedHeader.trim() === "") return;

          if (value.trim() !== "") {
            hasContent = true;
          }

          contact[mappedHeader] = value;
        });

        return hasContent ? contact : null;
      })
      .filter((contact): contact is Record<string, string> => contact !== null);
  };

  const handleImport = async () => {
    setIsCheckingLoading(true);
    try {
      const contacts = prepareContacts();
      if (contacts.length === 0) {
        toast.error("No contacts to import", {
          duration: 3000,
          style: {
            background: "#fee2e2",
            color: "#dc2626",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
          },
        });
        return;
      }
      const summary = await importContactsBulk(DEFAULT_COMPANY_ID, contacts);
      setImportSummary(summary);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to import contacts. Please try again.";
      console.error("Import failed:", err);
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          background: "#fee2e2",
          color: "#dc2626",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "500",
        },
      });
    } finally {
      setIsCheckingLoading(false);
    }
  };

  const handleNext = async () => {
    // Validation - using typed window interface
    type ValidationResult = {
      isValid: boolean;
      unmappedFields: Array<{ label: string }>;
    };
    type WindowWithValidation = Window & {
      validateDetectedFields?: () => ValidationResult;
      validateMapFields?: () => ValidationResult;
    };

    const validators: Record<number, keyof WindowWithValidation> = {
      1: "validateDetectedFields",
      2: "validateMapFields",
    };
    const fnName = validators[currentStep];
    const validateFn = fnName
      ? (window as WindowWithValidation)[fnName]
      : undefined;

    if (validateFn && typeof validateFn === "function") {
      const validation = validateFn();
      if (!validation.isValid) {
        toast.error(
          `Missing core field mappings: ${validation.unmappedFields
            .map((f: { label: string }) => f.label)
            .join(", ")}`,
          {
            duration: 5000,
            style: {
              background: "#fee2e2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "16px",
              fontSize: "14px",
              fontWeight: "500",
            },
          }
        );
        return;
      }
    }

    if (currentStep === 2) {
      await handleImport();
    }

    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setImportSummary({ created: 0, merged: 0, skipped: 0 });
    setIsCheckingLoading(false);
    onClose();
  };

  const handleMoveToContacts = () => {
    router.push("/dashboard");
    handleClose();
  };

  const renderContent = () => {
    if (isParsingLoading) return <ParsingFile />;
    if (isCheckingLoading) return <FinalChecksLoading />;

    switch (currentStep) {
      case 1:
        return <DetectedFields />;
      case 2:
        return <MapFields />;
      case 3:
        return <FinalChecksComplete importSummary={importSummary} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50 p-3 sm:p-0">
      <div className="flex flex-col bg-white w-full max-w-full sm:w-[1000px] h-[90vh] sm:h-[720px] rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 sm:px-6 py-3 border-b">
          <div className="flex items-center gap-3">
            <Image src="/icons/move.svg" alt="move" width={40} height={40} />
            <div>
              <h2 className="text-[16px] sm:text-[18px] font-medium text-[#0C5271]">
                Move Entry to Contact Section
              </h2>
              <p className="text-[13px] sm:text-[15px] text-[#89A6B2]">
                Step {currentStep} of 3
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="self-end sm:self-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 sm:px-8 py-3 sm:py-4 border-b">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <div key={step.number} className="flex items-center gap-3">
                {isCompleted ? (
                  <Image
                    src="/icons/complete.svg"
                    alt="complete"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div
                    className={`flex items-center justify-center w-8 h-8 sm:w-[42px] sm:h-[42px] rounded-lg text-[16px] sm:text-[20px] font-medium ${
                      isCurrent
                        ? "bg-[#0E4259] text-white"
                        : "bg-[#EBF0F8] text-gray-500"
                    }`}
                  >
                    {step.number}
                  </div>
                )}
                <div>
                  <p
                    className={`text-[14px] sm:text-[18px] font-medium ${
                      isCurrent ? "text-[#0E4259]" : "text-[#666666]"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[12px] sm:text-[15px] text-[#68818C]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg border font-medium ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
            >
              Prev
            </button>

            {currentStep === 3 ? (
              <button
                onClick={handleMoveToContacts}
                className="flex-1 sm:flex-none px-6 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 bg-[#0E4259] hover:bg-[#0E4259]/80"
              >
                Move to Contacts
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={isParsingLoading || isCheckingLoading}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-white font-medium ${
                  isParsingLoading || isCheckingLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#0E4259] hover:bg-[#0E4259]/80"
                }`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
