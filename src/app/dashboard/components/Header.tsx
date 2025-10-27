"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";

export default function Header() {
  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout clicked");
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Company name */}
          <div className="flex items-center min-w-0">
            <Image
              src="/logo.png"
              alt="Kendal Logo"
              width={32}
              height={32}
              className="mr-2 sm:mr-3 flex-shrink-0"
            />
            <h1 className="text-lg sm:text-xl font-bold text-white truncate">
              Kendal
            </h1>
          </div>

          {/* Right side - Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors duration-200 flex-shrink-0"
          >
            <LogOut className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
