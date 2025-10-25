"use client";

import type { ImportStep } from "./types";

interface StepIndicatorsProps {
  steps: ImportStep[];
  currentStep: number;
}

export default function StepIndicators({
  steps,
  currentStep,
}: StepIndicatorsProps) {
  return (
    <div className="flex justify-between items-center px-10 py-4 ">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`w-10 h-10  rounded-[8px] flex items-center justify-center text-sm font-medium ${
              currentStep >= step.id
                ? "bg-[#0E4259] text-white"
                : "bg-[#EBF0F8] text-[#8C8DB0]"
            }`}
          >
            {step.id}
          </div>
          <div className="ml-3">
            <p
              className={`text-sm font-medium ${
                currentStep >= step.id ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {step.title}
            </p>
            <p className="text-xs text-gray-400">{step.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
