"use client";

import { useState, useEffect, useRef } from "react";
import { Zap, CheckCircle, WrenchIcon, Download } from "lucide-react";
import { getSmartColumnPredictions } from "@/utils/helper";
import { useFileContext } from "@/contexts/FileContext";
import { useFileParser } from "@/hooks/useFileParser";

interface UploadProps {
  onFileSelect: () => void;
  onCloseModal: () => void; // 👈 new prop to close modal
}

export default function Upload({ onFileSelect, onCloseModal }: UploadProps) {
  const {
    data,
    loading: fileLoading,
    error: fileError,
    handleFile,
  } = useFileParser();

  const { setFileData, setIsParsingLoading } = useFileContext();

  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const hasOpenedModalRef = useRef(false);

  // 🔹 Trigger prediction whenever file data changes
  useEffect(() => {
    if (!data || hasOpenedModalRef.current) return;
    hasOpenedModalRef.current = true;
    onFileSelect(); // ✅ Open modal when file selected

    const fetchPredictions = async () => {
      setIsParsingLoading(true);
      setLoadingPredictions(true);
      setPredictionError(null);

      try {
        // Convert Record<string, any>[] to string[][]
        const rowsAsArrays: string[][] = data.rows.map((row) =>
          data.headers.map((header) => String(row[header] || ""))
        );

        const result = await getSmartColumnPredictions(
          data.headers,
          rowsAsArrays
        );

        // ✅ Save everything in context
        setFileData({
          headers: data.headers,
          rows: rowsAsArrays,
          predictions: result,
        });
      } catch (err: unknown) {
        console.error("Prediction error:", err);
        setPredictionError(
          err instanceof Error ? err.message : "Failed to get predictions"
        );
        onCloseModal(); // ❌ Close modal if prediction fails
      } finally {
        setLoadingPredictions(false);
        setIsParsingLoading(false);
      }
    };

    fetchPredictions();
  }, [data, setFileData, onFileSelect, onCloseModal]);

  // ❌ Also close modal if parsing fails
  useEffect(() => {
    if (fileError) {
      onCloseModal();
    }
  }, [fileError, onCloseModal]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    hasOpenedModalRef.current = false;
    await handleFile(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
          Upload your CSV or Excel file and let AI automatically map your
          columns to contact fields
        </h1>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 sm:p-12 text-center mb-6 sm:mb-8">
        <Download className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
        <p className="text-base sm:text-lg text-gray-700 mb-2">
          Drop your files here, or{" "}
          <label
            htmlFor="file-upload"
            className="text-blue-600 underline cursor-pointer"
          >
            browse
          </label>
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">
          Supports CSV and Excel files (.csv, .xlsx, .xls)
        </p>
        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
          disabled={fileLoading || loadingPredictions}
        />
        <button
          onClick={() => document.getElementById("file-upload")?.click()}
          disabled={fileLoading || loadingPredictions}
          className="bg-blue-600 text-white px-5 sm:px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {fileLoading || loadingPredictions
            ? "Processing..."
            : "Start Import Process"}
        </button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
            Smart AI Mapping
          </h3>
          <p className="text-gray-600 text-sm">
            Automatically detects and maps your columns to contact fields using
            intelligent pattern recognition.
          </p>
        </div>

        <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
            Duplicate Detection
          </h3>
          <p className="text-gray-600 text-sm">
            Finds and merges duplicate contacts based on phone number or email
            address.
          </p>
        </div>

        <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <WrenchIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
            Custom Fields
          </h3>
          <p className="text-gray-600 text-sm">
            Support for custom contact fields with different data types and
            validation.
          </p>
        </div>
      </div>

      {/* Error Messages */}
      {(fileError || predictionError) && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          {fileError && (
            <p className="text-red-600 text-sm">Error: {fileError}</p>
          )}
          {predictionError && (
            <p className="text-red-600 text-sm">
              Prediction error: {predictionError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
