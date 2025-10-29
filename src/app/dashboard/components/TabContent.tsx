"use client";

import { useSearchParams } from "next/navigation";
import Upload from "./tabs/Upload";
import ContactsTable from "./tabs/ContactsTable";
import UsersTab from "./tabs/UsersTab";

interface TabContentProps {
  onFileSelect: () => void;
  onCloseModal: () => void;
}

export default function TabContent({
  onFileSelect,
  onCloseModal,
}: TabContentProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "contacts";

  const renderTabContent = () => {
    switch (activeTab) {
      case "contacts":
        return <ContactsTable />;
      case "import":
        return (
          <Upload onFileSelect={onFileSelect} onCloseModal={onCloseModal} />
        );
      case "users":
        return <UsersTab />;
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
