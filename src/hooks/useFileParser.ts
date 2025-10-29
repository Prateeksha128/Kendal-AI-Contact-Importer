import { useState } from "react";
import { ParsedFileType } from "@/types";
import { parseFile } from "@/utils/parseFile";

export function useFileParser() {
  const [data, setData] = useState<ParsedFileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseFile(file);
      setData(parsed);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to parse file";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, handleFile };
}
