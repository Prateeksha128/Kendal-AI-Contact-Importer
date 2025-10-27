// Core data types based on Firestore structure

export type ColumnPrediction = {
  originalHeader: string;
  suggestedHeader: string;
  confidence: number; // 0 - 1
  isCustom: boolean;
};

export interface User {
  uid: string;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface Contact {
  id?: string; // Firestore document ID
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  agentUid?: string; // Reference to User.uid
  createdOn: Date;
  // Custom fields will be added dynamically
  [key: string]: any;
}

export interface ContactField {
  id: string; // Document ID
  label: string;
  type: "text" | "number" | "phone" | "email" | "datetime";
  core: boolean; // Core fields cannot be deleted
  createdAt?: Date;
}

// Form types for adding/editing
export interface CreateUserForm {
  name: string;
  email: string;
}

export interface CreateContactForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  agentUid?: string;
}

export interface CreateContactFieldForm {
  label: string;
  type: ContactField["type"];
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
    operator: any; // WhereFilterOp from firebase
    value: any;
  }[];
}

// Raw file parsing result (before prediction processing)
export type ParsedFileType = {
  headers: string[];
  rows: Record<string, any>[];
};

// Processed file data with predictions (used in context)
export type ParsedFileData = {
  headers: string[];
  rows: string[][];
  predictions: ColumnPrediction[];
};
