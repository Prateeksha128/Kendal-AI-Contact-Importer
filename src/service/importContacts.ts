import { Timestamp } from "firebase/firestore";
import {
  getDocuments,
  updateDocument,
  batchAddDocuments,
} from "@/lib/firestore";
import { auth } from "@/lib/firebase";

export async function importContactsBulk(companyId: string, rows: any[]) {
  const summary = { created: 0, merged: 0, skipped: 0 };

  // 1️⃣ Get users
  const usersRes = await getDocuments("users", {}, companyId);
  const userEmailToUid = new Map<string, string>();
  (usersRes.data || []).forEach((u: any) => {
    if (u.email)
      userEmailToUid.set(String(u.email).toLowerCase(), u.uid || u.id || "");
  });

  // 2️⃣ Get existing contactFields
  const fieldsRes = await getDocuments("contactFields", {}, companyId);
  const existingFieldLabels = new Set(
    (fieldsRes.data || []).map((f: any) => f.label.toLowerCase())
  );

  // 3️⃣ Add new fields if not in Firestore
  const headers = Object.keys(rows[0] || {});
  const newFields = headers.filter(
    (h) => !existingFieldLabels.has(h.toLowerCase())
  );

  if (newFields.length) {
    const newFieldDocs = newFields.map((label) => ({
      label,
      type: inferFieldType(label),
      core: false,
    }));
    await batchAddDocuments("contactFields", newFieldDocs, companyId);
  }

  // 4️⃣ Prefetch existing contacts
  const allContactsRes = await getDocuments("contacts", {}, companyId);
  const phoneMap = new Map<string, any>();
  const emailMap = new Map<string, any>();

  (allContactsRes.data || []).forEach((c: any) => {
    if (c.phone) phoneMap.set(String(c.phone).trim(), c);
    if (c.email) emailMap.set(String(c.email).trim().toLowerCase(), c);
  });

  // 5️⃣ Import rows
  const creates: any[] = [];
  const updates: any[] = [];

  for (const row of rows) {
    const phone = row.phone ? String(row.phone).trim() : undefined;
    const email = row.email
      ? String(row.email).trim().toLowerCase()
      : undefined;

    // detect agent email column
    const agentCol = Object.keys(row).find((k) =>
      k.toLowerCase().includes("agent")
    );
    const agentEmail = agentCol
      ? String(row[agentCol]).trim().toLowerCase()
      : "";
    const agentUid = agentEmail ? userEmailToUid.get(agentEmail) || null : null;

    const contactData = {
      ...row,
      agentUid,
      createdOn: row.createdOn || Timestamp.now(),
      lastUpdatedBy: auth.currentUser?.email || "",
    };

    const existing =
      (phone && phoneMap.get(phone)) || (email && emailMap.get(email));

    if (existing) {
      let changed = false;
      const merged = { ...existing };
      for (const k of Object.keys(contactData)) {
        const newVal = contactData[k];
        if (
          newVal &&
          String(newVal).trim() !== String(merged[k] ?? "").trim()
        ) {
          merged[k] = newVal;
          changed = true;
        }
      }

      if (changed) {
        updates.push({ id: existing.id, data: merged });
        summary.merged++;
      } else summary.skipped++;
    } else {
      creates.push(contactData);
      summary.created++;
    }
  }

  // 6️⃣ Commit changes
  for (const u of updates)
    await updateDocument("contacts", u.id, u.data, companyId);

  if (creates.length) await batchAddDocuments("contacts", creates, companyId);

  return summary;
}

function inferFieldType(header: string) {
  const lower = header.toLowerCase();
  if (lower.includes("email")) return "email";
  if (lower.includes("phone")) return "phone";
  if (lower.includes("date") || lower.includes("on")) return "datetime";
  if (lower.includes("amount") || lower.includes("count")) return "number";
  return "text";
}
