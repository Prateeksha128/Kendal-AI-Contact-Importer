"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function GoogleButton({
  className = "",
}: {
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      alert(`Welcome ${result.user.displayName}!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-semibold py-3 lg:py-4 px-4 lg:px-6 rounded-lg lg:rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 lg:space-x-4 shadow-lg hover:shadow-xl disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <div className="bg-white rounded-md p-1 w-7 h-7 flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">G</span>
          </div>
          <span className="text-sm lg:text-base">Continue with Google</span>
        </>
      )}
    </button>
  );
}
