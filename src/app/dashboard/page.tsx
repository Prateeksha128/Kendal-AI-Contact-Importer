"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "./_components/Header";
const TabNavigation = dynamic(() => import("./_components/TabNavigation"), {
  ssr: false,
});
const TabContent = dynamic(() => import("./_components/TabContent"), {
  ssr: false,
  loading: () => <div className="p-4">Loading content...</div>,
});
const ImportModal = dynamic(() => import("./_components/ImportModal"), {
  ssr: false,
});
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
      <Header />
      <TabNavigation variant="mobile" />
      <TabNavigation variant="desktop" />
      <div className="pt-32 lg:pt-16 lg:ml-64">
        <TabContent
          onFileSelect={handleFileSelect}
          onCloseModal={handleCloseModal}
        />
      </div>
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
