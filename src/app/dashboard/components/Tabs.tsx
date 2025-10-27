"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Users, FileUp, UserPlus } from "lucide-react";
import { TABS } from "@/constant";

const iconMap = {
  contacts: Users,
  import: FileUp,
  agents: UserPlus,
};

export default function Tabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "contacts";

  const handleTabClick = (tabKey: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabKey);
    router.push(`?${params.toString()}`);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full fixed top-16 left-0 bottom-0 z-40 hidden lg:block">
      <div className="p-4">
        <nav className="space-y-1">
          {TABS.map((tab) => {
            const Icon = iconMap[tab.key as keyof typeof iconMap];
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`w-full cursor-pointer flex items-center px-3 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
