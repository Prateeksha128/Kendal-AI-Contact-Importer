"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function FinalChecksLoading() {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    // Trigger fill once mounted
    const timer = setTimeout(() => setFilled(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-6 ">
      <div>
        <h3 className="text-[18px] font-semibold text-[#0E4259]">
          Checking for Duplicates & Errors…
        </h3>
        <p className="text-[#68818C] text-[16px] font-normal">
          Reviewing the entry data to ensure no duplicate contacts or invalid
          data slip through.
        </p>
      </div>

      <div className="flex flex-col gap-5 py-5">
        {/* AI Animation / Icon */}
        <div className="flex justify-center items-center">
          <Image
            src="/icons/checkRun.svg"
            alt="step1"
            width={120}
            height={120}
          />
        </div>

        <div className="flex flex-col gap-2 justify-center items-center">
          <h4 className="text-[20px] font-medium text-[#5883C9] mb-1">
            Running Final Checks…
          </h4>
          <p className="text-[#7782AD] w-[60%] text-[16px] font-normal text-center">
            Scanning entries for duplicates, missing details, or errors before
            the move to contact section completes…
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mx-auto mt-5 w-full max-w-md bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`bg-[#5883C9] h-2 rounded-full transition-all duration-[3000ms] ease-linear`}
            style={{ width: filled ? "80%" : "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
