"use client";

import Image from "next/image";
import React from "react";

export default function FinalChecksComplete() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-[18px] font-semibold text-[#0E4259]">
          Final Checks Complete
        </h3>
        <p className="text-[#68818C] text-[16px] font-normal">
          All checks completed successfully. Ready to import.
        </p>
      </div>

      <div className="flex flex-col gap-3 py-5">
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
          <h4 className="text-[20px] font-medium text-[#0E4259] mb-1 text-center w-[60%]">
            No Issue Founds! This Database entres are good to move to contacts
            section.
          </h4>
          <div className="flex gap-4 p-3 rounded-lg">
            <div className="p-4 rounded-lg bg-[#F2FFED]">
              <div className="flex flex-col items-center gap-2">
                <p className="text-[#008D0E] text-[14px] font-medium">
                  Total Contacts Imported
                </p>
                <p className="text-[#008D0E] text-[24px] font-bold">100</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#FFF7EA]">
              <div className="flex flex-col items-center gap-2">
                <p className="text-[#B67C0C] text-[14px] font-medium">
                  Total Contacts Imported
                </p>
                <p className="text-[#B67C0C] text-[24px] font-bold">100</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#FFEDED]">
              <div className="flex flex-col items-center gap-2">
                <p className="text-[#C4494B] text-[14px] font-medium">
                  Total Contacts Imported
                </p>
                <p className="text-[#C4494B] text-[24px] font-bold">100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
