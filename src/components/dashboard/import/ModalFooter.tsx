"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface ModalFooterProps {
  currentStep: number;
  totalSteps: number;
  isProcessing: boolean;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function ModalFooter({
  currentStep,
  totalSteps,
  isProcessing,
  onCancel,
  onPrevious,
  onNext,
}: ModalFooterProps) {
  return (
    <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
      >
        Cancel
      </button>

      <div className="flex space-x-3">
        <button
          onClick={onPrevious}
          disabled={currentStep === 1}
          className={`flex items-center px-4 py-2 font-medium transition-colors ${
            currentStep === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={isProcessing || currentStep === totalSteps}
          className={`flex items-center px-6 py-2 font-medium rounded-lg transition-colors ${
            isProcessing || currentStep === totalSteps
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-slate-800 text-white hover:bg-slate-900"
          }`}
        >
          {currentStep === totalSteps ? "Complete Import" : "Next"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
