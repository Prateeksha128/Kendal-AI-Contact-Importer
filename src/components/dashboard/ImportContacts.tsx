"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { UploadArea, FeatureGrid, ImportModal } from "./import";
import type { ImportStep, FileData } from "./import";

const steps: ImportStep[] = [
  { id: 1, title: "Detect Fields", subtitle: "Review data structure" },
  { id: 2, title: "Map Fields", subtitle: "Connect to CRM Fields" },
  { id: 3, title: "Final Checks", subtitle: "For Duplicates or Errors" },
];

export default function ImportContacts() {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const parseFile = useCallback(async (file: File): Promise<FileData> => {
    return new Promise((resolve, reject) => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (fileExtension === "csv") {
        Papa.parse(file, {
          complete: (results) => {
            const data = results.data as string[][];
            const columns = data[0] || [];
            const rows = data.slice(1);
            resolve({
              name: file.name,
              data: rows,
              columns: columns,
            });
          },
          header: false,
          skipEmptyLines: true,
          error: (error) => reject(error),
        });
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            }) as string[][];

            const columns = jsonData[0] || [];
            const rows = jsonData.slice(1);
            resolve({
              name: file.name,
              data: rows,
              columns: columns,
            });
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error("Unsupported file format"));
      }
    });
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploadedFile(file);
      setShowModal(true);
      setCurrentStep(1);
      setIsProcessing(true);

      try {
        // Simulate AI processing time
        setTimeout(async () => {
          try {
            const parsedData = await parseFile(file);
            setFileData(parsedData);
            setIsProcessing(false);
          } catch (error) {
            console.error("Error parsing file:", error);
            setIsProcessing(false);
            // Handle error state
          }
        }, 2000);
      } catch (error) {
        console.error("Error processing file:", error);
        setIsProcessing(false);
      }
    },
    [parseFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setCurrentStep(1);
    setIsProcessing(false);
    setFileData(null);
    setUploadedFile(null);
  };

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-sans text-gray-900 mb-4">
            Import Contacts with Smart Field Mapping
          </h2>
          <p className="text-gray-600 font-sans mb-8">
            Upload your CSV or Excel file and let AI automatically map your
            columns to contact fields
          </p>

          {/* Upload Area */}
          <UploadArea
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
          />
        </div>

        {/* Features */}
        <FeatureGrid />
      </div>

      {/* Import Modal */}
      {showModal && (
        <ImportModal
          steps={steps}
          currentStep={currentStep}
          isProcessing={isProcessing}
          fileData={fileData}
          uploadedFile={uploadedFile}
          onCancel={handleCancel}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </>
  );
}
