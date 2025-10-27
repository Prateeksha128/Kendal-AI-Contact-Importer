// context/FileContext.tsx
"use client";

import { ParsedFileData } from "@/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

type FileContextType = {
  // File data
  fileData: ParsedFileData | null;
  setFileData: (data: ParsedFileData) => void;
  clearFileData: () => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [fileData, setFileDataState] = useState<ParsedFileData | null>(null);

  const setFileData = (data: ParsedFileData) => {
    setFileDataState(data);
  };

  const clearFileData = () => {
    setFileDataState(null);
  };

  return (
    <FileContext.Provider
      value={{
        fileData,
        setFileData,
        clearFileData,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

// Custom hook to use context
export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
};
