import { ContactField } from "@/types/index";

export const TABS = [
  { key: "contacts", label: "Contacts" },
  { key: "import", label: "Import Contacts" },
  { key: "users", label: "Agents" },
];

// Centralized CRM for validation and mapping
export const CONTACT_FIELDS: ContactField[] = [
  { id: "firstName", label: "First Name", type: "text", core: true },
  { id: "lastName", label: "Last Name", type: "text", core: true },
  { id: "phone", label: "Phone", type: "phone", core: true },
  { id: "email", label: "Email", type: "email", core: true },
  // { id: "agentUid", label: "Agent", type: "text", core: true },
  // { id: "createdOn", label: "Created On", type: "datetime", core: true },
];

export const features = [
  {
    title: "AI-Powered Organization",
    description:
      "Automatically map, categorize, and deduplicate contacts for a cleaner, smarter database.",
    gradient: "from-blue-400 to-purple-400",
    hover: "group-hover:text-blue-200",
  },
  {
    title: "Seamless Team Collaboration",
    description: "Assign and manage contacts across your agents with ease.",
    gradient: "from-green-400 to-blue-400",
    hover: "group-hover:text-green-200",
  },
  {
    title: "Enterprise-Grade Security",
    description:
      "All your contact data is safely stored with Firebase and follows industry-standard security practices.",
    gradient: "from-purple-400 to-pink-400",
    hover: "group-hover:text-purple-200",
  },
];