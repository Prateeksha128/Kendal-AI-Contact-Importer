"use client";

import { useState, useEffect, useRef } from "react";
import { FileUp } from "lucide-react";
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

  const { fileData, setFileData } = useFileContext();

  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const hasOpenedModalRef = useRef(false);

  // 🔹 Trigger prediction whenever file data changes
  useEffect(() => {
    if (!data || hasOpenedModalRef.current) return;
    hasOpenedModalRef.current = true;
    onFileSelect(); // ✅ Open modal when file selected

    const fetchPredictions = async () => {
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
        console.log("Predicted column mapping:", result);

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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Upload File</h2>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <FileUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Click to upload CSV or Excel file
          </span>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
          disabled={fileLoading || loadingPredictions}
        />
        <p className="text-xs text-gray-500 mt-2">CSV, XLS, XLSX files</p>
      </div>

      {fileError && <p className="mt-4 text-red-600">Error: {fileError}</p>}
      {predictionError && (
        <p className="mt-4 text-red-600">Prediction error: {predictionError}</p>
      )}
    </div>
  );
}
