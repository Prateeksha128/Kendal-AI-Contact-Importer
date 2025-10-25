"use client";

import { Upload } from "lucide-react";

interface UploadAreaProps {
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
}

export default function UploadArea({
  getRootProps,
  getInputProps,
  isDragActive,
}: UploadAreaProps) {
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer ${
        isDragActive
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 mb-2">
          {isDragActive ? (
            "Drop the files here..."
          ) : (
            <>
              Drop your files here, or{" "}
              <span className="text-blue-600 hover:text-blue-700 font-medium">
                browse
              </span>
            </>
          )}
        </p>
        <p className="text-sm text-gray-500">
          Supports CSV and Excel files (.csv, .xlsx, .xls)
        </p>
      </div>
    </div>
  );
}
