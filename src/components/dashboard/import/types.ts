export interface ImportStep {
  id: number;
  title: string;
  subtitle: string;
}

export interface FileData {
  name: string;
  data: string[][];
  columns: string[];
}
