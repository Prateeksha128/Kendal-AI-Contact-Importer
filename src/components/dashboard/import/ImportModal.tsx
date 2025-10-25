"use client";

import { X } from "lucide-react";
import StepIndicators from "./StepIndicators";
import StepContent from "./StepContent";
import ModalFooter from "./ModalFooter";
import type { ImportStep, FileData } from "./types";
import Image from "next/image";

interface ImportModalProps {
  steps: ImportStep[];
  currentStep: number;
  isProcessing: boolean;
  fileData: FileData | null;
  uploadedFile: File | null;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function ImportModal({
  steps,
  currentStep,
  isProcessing,
  fileData,
  uploadedFile,
  onCancel,
  onPrevious,
  onNext,
}: ImportModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 ">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center ">
                <Image
                  src="/move.svg"
                  alt="Move Import"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <h2 className="text--[18px] font-medium text-[#0C5271] font-sans">
                  Move Entry to Contact Section
                </h2>
                <p className="text-[15px] text-[#89A6B2] ">
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
            <StepIndicators steps={steps} currentStep={currentStep} />
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <StepContent
            currentStep={currentStep}
            isProcessing={isProcessing}
            fileData={fileData}
            uploadedFile={uploadedFile}
          />
        </div>

        {/* Modal Footer */}
        <ModalFooter
          currentStep={currentStep}
          totalSteps={steps.length}
          isProcessing={isProcessing}
          onCancel={onCancel}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </div>
    </div>
  );
}
