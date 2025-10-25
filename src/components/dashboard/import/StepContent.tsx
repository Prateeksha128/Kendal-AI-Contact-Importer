"use client";

import { Zap } from "lucide-react";
import type { FileData } from "./types";

interface StepContentProps {
  currentStep: number;
  isProcessing: boolean;
  fileData: FileData | null;
  uploadedFile: File | null;
}

function Step1Content({
  isProcessing,
  fileData,
  uploadedFile,
}: {
  isProcessing: boolean;
  fileData: FileData | null;
  uploadedFile: File | null;
}) {
  if (isProcessing) {
    return (
      <>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          AI Column Detection...
        </h3>
        <p className="text-gray-600 mb-8">
          Analyzing {fileData?.columns.length || 0} columns and matching with
          CRM fields using AI...
        </p>

        {/* Loading Animation */}
        <div className="flex justify-center mb-8">
          <div className="bg-blue-50 p-8 rounded-lg">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-blue-600 font-medium">
                Auto Detecting Field Mapping...
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Matching spreadsheet columns to CRM fields using intelligent pattern
          recognition...
        </p>

        {/* Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full animate-pulse"
              style={{ width: "65%" }}
            ></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Fields Detected Successfully!
      </h3>
      <p className="text-gray-600 mb-8">
        Found {fileData?.columns.length} columns in {uploadedFile?.name}
      </p>

      {/* Detected Columns Preview */}
      {fileData && (
        <div className="bg-gray-50 rounded-lg p-6 text-left max-w-2xl mx-auto">
          <h4 className="font-medium text-gray-900 mb-4">Detected Columns:</h4>
          <div className="grid grid-cols-2 gap-2">
            {fileData.columns.slice(0, 8).map((column, index) => (
              <div
                key={index}
                className="bg-white px-3 py-2 rounded text-sm text-gray-700 border"
              >
                {column || `Column ${index + 1}`}
              </div>
            ))}
            {fileData.columns.length > 8 && (
              <div className="bg-blue-50 px-3 py-2 rounded text-sm text-blue-600 border border-blue-200">
                +{fileData.columns.length - 8} more columns
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Step2Content() {
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Field Mapping
      </h3>
      <p className="text-gray-600 mb-8">
        Map your file columns to contact fields
      </p>
      <div className="bg-gray-100 p-8 rounded-lg">
        <p className="text-gray-500">
          Field mapping interface will be implemented here
        </p>
      </div>
    </>
  );
}

function Step3Content() {
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Final Review</h3>
      <p className="text-gray-600 mb-8">
        Review your import settings and check for duplicates
      </p>
      <div className="bg-gray-100 p-8 rounded-lg">
        <p className="text-gray-500">
          Final review interface will be implemented here
        </p>
      </div>
    </>
  );
}

export default function StepContent({
  currentStep,
  isProcessing,
  fileData,
  uploadedFile,
}: StepContentProps) {
  return (
    <div className="text-center py-12">
      {currentStep === 1 && (
        <Step1Content
          isProcessing={isProcessing}
          fileData={fileData}
          uploadedFile={uploadedFile}
        />
      )}
      {currentStep === 2 && <Step2Content />}
      {currentStep === 3 && <Step3Content />}
    </div>
  );
}
