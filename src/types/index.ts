// Core data types based on Firestore structure

export type ColumnPrediction = {
  originalHeader: string;
  suggestedHeader: string;
  confidence: number; // 0 - 1
  isCustom: boolean;
};

export interface Contact {
  id?: string; // Firestore document ID
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  agentUid?: string; // Reference to User.uid
  createdOn: Date;
  // Custom fields will be added dynamically
  [key: string]: unknown;
}

export interface ContactField {
  id: string; // Document ID
  label: string;
  type: "text" | "number" | "phone" | "email" | "datetime";
  core: boolean; // Core fields cannot be deleted
  createdAt?: Date;
}

export interface User {
  id?: string; // Firestore document ID
  uid: string; // User unique identifier
  name: string;
  email: string;
  createdAt?: unknown; // Firestore Timestamp
  updatedAt?: unknown; // Firestore Timestamp
}

// API response types
export interface FirestoreResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Firestore query options
export interface QueryOptions {
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  limit?: number;
  where?: {
    field: string;
    operator: string; // WhereFilterOp from firebase
    value: unknown;
  }[];
}

// Raw file parsing result (before prediction processing)
export type ParsedFileType = {
  headers: string[];
  rows: Record<string, unknown>[];
};

// Processed file data with predictions (used in context)
export type ParsedFileData = {
  headers: string[];
  rows: string[][];
  predictions: ColumnPrediction[];
};

// Import summary type
export interface ImportSummary {
  created: number;
  merged: number;
  skipped: number;
}
