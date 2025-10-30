import { ContactField } from "./types";

export const TABS = [
  { key: "contacts", label: "Contacts" },
  { key: "import", label: "Import Contacts" },
  { key: "users", label: "Agents" },
];

// Centralized CRM Contact Field Definitions
export const CONTACT_FIELDS: ContactField[] = [
  { id: "firstName", label: "First Name", type: "text", core: true },
  { id: "lastName", label: "Last Name", type: "text", core: true },
  { id: "phone", label: "Phone", type: "phone", core: true },
  { id: "email", label: "Email", type: "email", core: true },
  // { id: "agentUid", label: "Agent", type: "text", core: true },
  // { id: "createdOn", label: "Created On", type: "datetime", core: true },
];
