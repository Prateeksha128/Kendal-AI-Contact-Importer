"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
const Upload = dynamic(() => import("./tabs/Upload"), {
  ssr: false,
});
const ContactsTable = dynamic(() => import("./tabs/ContactsTable"), {
  ssr: false,
  loading: () => <div className="p-4">Loading contacts...</div>,
});
const UsersTab = dynamic(() => import("./tabs/UsersTab"), {
  ssr: false,
});

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
