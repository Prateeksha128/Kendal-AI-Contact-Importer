"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import Header from "./components/Header";
import TabNavigation from "./components/TabNavigation";
import TabContent from "./components/TabContent";
import ImportModal from "./components/ImportModal";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
function DashboardContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const handleFileSelect = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <Header />

      {/* Mobile Tabs */}
      <TabNavigation variant="mobile" />

      {/* Desktop Sidebar */}
      <TabNavigation variant="desktop" />

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
