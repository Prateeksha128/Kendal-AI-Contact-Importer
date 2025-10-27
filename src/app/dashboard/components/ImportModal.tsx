"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ParsingFile,
  DetectedFields,
  MapFields,
  FinalChecksLoading,
  FinalChecksComplete,
} from "./steps";

const steps = [
  { number: 1, title: "Detect Fields", description: "Review data structure" },
  { number: 2, title: "Map Fields", description: "Connect to CRM Fields" },
  { number: 3, title: "Final Checks", description: "For Duplicates or Errors" },
];

const LOADING_STAGES = [
  "PARSING_FILE",
  "DETECTED_FIELDS",
  "MAP_FIELDS",
  "FINAL_CHECKS_LOADING",
  "FINAL_CHECKS_COMPLETE",
] as const;

type LoadingStage = (typeof LOADING_STAGES)[number];

const STAGE_COMPONENTS = {
  PARSING_FILE: ParsingFile,
  DETECTED_FIELDS: DetectedFields,
  MAP_FIELDS: MapFields,
  FINAL_CHECKS_LOADING: FinalChecksLoading,
  FINAL_CHECKS_COMPLETE: FinalChecksComplete,
} as const;

const STAGE_TO_STEP = {
  PARSING_FILE: 1,
  DETECTED_FIELDS: 1,
  MAP_FIELDS: 2,
  FINAL_CHECKS_LOADING: 3,
  FINAL_CHECKS_COMPLETE: 3,
} as const;

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(
    LOADING_STAGES[0]
  );

  const currentIndex = LOADING_STAGES.indexOf(loadingStage);
  const currentStep = STAGE_TO_STEP[loadingStage];

  // 🧠 Auto transition (every 2s)
  useEffect(() => {
    if (!isOpen) return;

    if (currentIndex === 0 || currentIndex === LOADING_STAGES.length - 2) {
      const timer = setTimeout(() => {
        setLoadingStage(LOADING_STAGES[currentIndex + 1]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isOpen]);

  const handleClose = () => {
    setLoadingStage(LOADING_STAGES[0]);
    onClose();
  };

  // Manual navigation handlers
  const handleNext = () => {
    const validators: Record<string, string> = {
      DETECTED_FIELDS: "validateDetectedFields",
      MAP_FIELDS: "validateMapFields",
    };

    const fnName = validators[loadingStage];
    const validateFn = (window as any)[fnName];

    if (validateFn) {
      const validation = validateFn();
      if (!validation.isValid) {
        toast.error(
          `Missing core field mappings: ${validation.unmappedFields
            .map(
              (f: { label: string; value: string; core: boolean }) => f.label
            )
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

    // Proceed only if valid and not at end
    if (currentIndex < LOADING_STAGES.length - 1) {
      setLoadingStage(LOADING_STAGES[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setLoadingStage(LOADING_STAGES[currentIndex - 1]);
    }
  };

  const renderContent = () => {
    const Component = STAGE_COMPONENTS[loadingStage];
    return <Component />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
      <div className="flex flex-col bg-white w-[1000px] h-[720px] rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 border-b">
          <div className="flex items-center gap-3">
            <Image src="/icons/move.svg" alt="move" width={47} height={47} />
            <div>
              <h2 className="text-[18px] font-medium text-[#0C5271]">
                Move Entry to Contact Section
              </h2>
              <p className="text-[15px] text-[#89A6B2]">
                Step {currentStep} of 3
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between items-center px-8 py-4 border-b">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <div key={step.number} className="flex items-center gap-3">
                {isCompleted ? (
                  <Image
                    src="/icons/complete.svg"
                    alt="complete"
                    width={42}
                    height={42}
                  />
                ) : (
                  <div
                    className={`flex items-center w-[42px] h-[42px] justify-center rounded-lg text-[20px] font-medium transition-colors ${
                      isCurrent
                        ? "bg-[#0E4259] text-white"
                        : "bg-[#EBF0F8] text-gray-500"
                    }`}
                  >
                    {step.number}
                  </div>
                )}

                <div className="flex flex-col">
                  <p
                    className={`text-[18px] font-medium ${
                      isCurrent ? "text-[#0E4259]" : "text-[#666666]"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[15px] text-[#68818C]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-5 py-2 rounded-lg border font-medium transition-colors ${
                currentIndex === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
            >
              Prev
            </button>

            {loadingStage === "FINAL_CHECKS_COMPLETE" ? (
              <button
                onClick={handleClose}
                className="px-6 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2 bg-[#0E4259] hover:bg-[#0E4259]/80"
              >
                Move to Contacts
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentIndex === LOADING_STAGES.length - 1}
                className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                  currentIndex === LOADING_STAGES.length - 1
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
