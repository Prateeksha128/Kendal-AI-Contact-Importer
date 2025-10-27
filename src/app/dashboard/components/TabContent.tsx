"use client";

import { useSearchParams } from "next/navigation";
import Upload from "./tabs/Upload";
import ContactsTable from "./tabs/ContactsTable";

interface TabContentProps {
  onFileSelect: () => void;
  onCloseModal: () => void;
}

export default function TabContent({ onFileSelect, onCloseModal }: TabContentProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "contacts";

  const renderTabContent = () => {
    switch (activeTab) {
      case "contacts":
        return <ContactsTable />;
      case "import":
        return <Upload onFileSelect={onFileSelect} onCloseModal={onCloseModal} />;
      case "agents":
        return (
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Agents</h2>
            <p className="text-gray-500">
              Agents content will be displayed here.
            </p>
          </div>
        );
      default:
        return <ContactsTable />;
    }
  };

  return (
    <main className="min-h-screen lg:h-screen overflow-y-auto">
      <div className="transition-opacity duration-200">
        {renderTabContent()}
      </div>
    </main>
  );
}
