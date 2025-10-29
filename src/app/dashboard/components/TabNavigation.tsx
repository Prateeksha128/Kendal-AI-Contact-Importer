"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Users, FileUp, UserCheck } from "lucide-react";
import { TABS } from "@/constant";

const iconMap = {
  contacts: Users,
  import: FileUp,
  users: UserCheck,
};

interface TabNavigationProps {
  variant: "desktop" | "mobile";
}

export default function TabNavigation({ variant }: TabNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "contacts";

  const handleTabClick = (tabKey: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabKey);
    router.push(`?${params.toString()}`);
  };

  if (variant === "desktop") {
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

  return (
    <nav className="bg-white border-b border-gray-200 lg:hidden fixed top-16 left-0 right-0 z-40">
      <div className="px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = iconMap[tab.key as keyof typeof iconMap];
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`flex items-center px-3 py-3 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
