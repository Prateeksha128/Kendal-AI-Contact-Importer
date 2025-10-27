"use client";

import { Suspense, useState, useCallback } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import MobileTabs from "./components/MobileTabs";
import TabContent from "./components/TabContent";
import ImportModal from "./components/ImportModal";

function DashboardContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileSelect = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <Header />

      {/* Mobile Tabs */}
      <MobileTabs />

      {/* Desktop Sidebar */}
      <Tabs />

      {/* Main Content */}
      <div className="pt-32 lg:pt-16 lg:ml-64">
        <TabContent
          onFileSelect={handleFileSelect}
          onCloseModal={handleCloseModal}
        />
      </div>

      {/* Import Modal */}
      <ImportModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
