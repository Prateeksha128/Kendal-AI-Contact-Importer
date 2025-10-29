import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  where,
  WhereFilterOp,
  QueryConstraint,
  DocumentData,
  CollectionReference,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FirestoreResponse, QueryOptions } from "@/types";

// Configuration
const DEFAULT_COMPANY_ID = "kendal";

// Generic collection reference helper
export function getCollectionRef(
  collectionName: string,
  companyId: string = DEFAULT_COMPANY_ID
): CollectionReference<DocumentData> {
  return collection(db, "companies", companyId, collectionName);
}

// Ensure company document exists
export async function ensureCompanyDoc(
  companyId: string = DEFAULT_COMPANY_ID
): Promise<void> {
  try {
    const companyRef = doc(db, "companies", companyId);
    const companySnap = await getDoc(companyRef);

    if (!companySnap.exists()) {
      await setDoc(companyRef, {
        id: companyId,
        name: companyId === DEFAULT_COMPANY_ID ? "Kendal" : companyId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error ensuring company document:", error);
    throw error;
  }
}

// Generic CRUD Operations

// Add document
export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: Omit<T, "id">,
  companyId: string = DEFAULT_COMPANY_ID
): Promise<FirestoreResponse<T & { id: string }>> {
  try {
    await ensureCompanyDoc(companyId);

    const docData = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      getCollectionRef(collectionName, companyId),
      docData
    );

    return {
      success: true,
      data: { ...docData, id: docRef.id } as any as T & { id: string },
    };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    return {
      success: false,
      error: `Failed to add ${collectionName.slice(0, -1)}`,
    };
  }
}

// Get all documents
export async function getDocuments<T extends DocumentData>(
  collectionName: string,
  options: QueryOptions = {},
  companyId: string = DEFAULT_COMPANY_ID
): Promise<FirestoreResponse<T[]>> {
  try {
    await ensureCompanyDoc(companyId);

    const collectionRef = getCollectionRef(collectionName, companyId);
    const constraints: QueryConstraint[] = [];

    // Add where constraints
    if (options.where) {
      options.where.forEach((whereClause) => {
        constraints.push(
          where(
            whereClause.field,
            whereClause.operator as WhereFilterOp,
            whereClause.value
          )
        );
      });
    }

    // Add orderBy constraint
    if (options.orderByField) {
      constraints.push(
        orderBy(options.orderByField, options.orderDirection || "desc")
      );
    }

    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const documents: T[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ ...doc.data(), id: doc.id } as any as T);
    });

    return {
      success: true,
      data: documents,
    };
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    return {
      success: false,
      error: `Failed to fetch ${collectionName}`,
    };
  }
}

// Get single document by ID
export async function getDocumentById<T extends DocumentData>(
  collectionName: string,
  documentId: string,
  companyId: string = DEFAULT_COMPANY_ID
): Promise<FirestoreResponse<T>> {
  try {
    const docRef = doc(db, "companies", companyId, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: true,
        data: { ...docSnap.data(), id: docSnap.id } as any as T,
      };
    } else {
      return {
        success: false,
        error: `${collectionName.slice(0, -1)} not found`,
      };
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    return {
      success: false,
      error: `Failed to fetch ${collectionName.slice(0, -1)}`,
    };
  }
}

// Update document
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: Partial<Omit<T, "id" | "createdAt">>,
  companyId: string = DEFAULT_COMPANY_ID
): Promise<FirestoreResponse<void>> {
  try {
    const docRef = doc(db, "companies", companyId, collectionName, documentId);

    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);

    return { success: true };
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    return {
      success: false,
      error: `Failed to update ${collectionName.slice(0, -1)}`,
    };
  }
}

// Delete document
export async function deleteDocument(
  collectionName: string,
  documentId: string,
  companyId: string = DEFAULT_COMPANY_ID
): Promise<FirestoreResponse<void>> {
  try {
    const docRef = doc(db, "companies", companyId, collectionName, documentId);
    await deleteDoc(docRef);

    return { success: true };
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    return {
      success: false,
      error: `Failed to delete ${collectionName.slice(0, -1)}`,
    };
  }
}

// Batch operations helper
export async function batchAddDocuments<T extends DocumentData>(
  collectionName: string,
  documents: Omit<T, "id">[],
  companyId: string = DEFAULT_COMPANY_ID,
  batchSize: number = 500
): Promise<FirestoreResponse<string[]>> {
  try {
    await ensureCompanyDoc(companyId);

    const results: string[] = [];
    const collectionRef = getCollectionRef(collectionName, companyId);

    // Process documents in batches
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);

      const batchPromises = batch.map(async (docData) => {
        const processedData = {
          ...docData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collectionRef, processedData);
        return docRef.id;
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error(`Error batch adding documents to ${collectionName}:`, error);
    return {
      success: false,
      error: `Failed to batch add ${collectionName}`,
    };
  }
}

// Export default company ID for convenience
export { DEFAULT_COMPANY_ID };
