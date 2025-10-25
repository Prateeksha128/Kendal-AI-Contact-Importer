"use client";

import { useState } from "react";
import Header from "./Header";
import ContactTable from "./ContactTable";
import ImportContacts from "./ImportContacts";
import Users from "./Users";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("contacts");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleImportClick = () => {
    setActiveTab("import");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "contacts":
        return <ContactTable onImportClick={handleImportClick} />;
      case "import":
        return <ImportContacts />;
      case "users":
        return <Users />;
      default:
        return <ContactTable onImportClick={handleImportClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
