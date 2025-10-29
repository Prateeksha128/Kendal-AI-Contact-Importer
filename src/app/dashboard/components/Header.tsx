"use client";

import Image from "next/image";
import { LogOut, User, ChevronDown } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

          {/* Right side - User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors duration-200"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline truncate max-w-32">
                {auth.currentUser?.email}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Dropdown menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-md shadow-lg border border-slate-700 z-50">
                <div className="py-1">
                  {/* User info */}
                  <div className="px-4 py-2 border-b border-slate-700">
                    <p className="text-sm text-gray-300">Signed in as</p>
                    <p className="text-sm font-medium text-white">
                      {auth.currentUser?.email}
                    </p>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 transition-colors duration-200"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
