"use client";

import Image from "next/image";
import { ImportSummary } from "@/types";

export default function FinalChecksComplete({
  importSummary,
}: { importSummary: ImportSummary } & { importSummary: ImportSummary }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div>
        <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#0E4259]">
          Final Checks Complete
        </h3>
        <p className="text-[#68818C] text-[14px] sm:text-[16px] font-normal">
          All checks completed successfully. Ready to import.
        </p>
      </div>

      <div className="flex flex-col gap-3 py-4 sm:py-5">
        <div className="flex justify-center items-center">
          <Image
            src="/icons/checkRun.svg"
            alt="step1"
            width={96}
            height={96}
            className="sm:w-[120px] sm:h-[120px]"
          />
        </div>

        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <h4 className="text-[16px] sm:text-[20px] font-medium text-[#0E4259] mb-1 text-center w-[90%] sm:w-[60%]">
            No issues found! These contacts are ready to move to the contacts
            section.
          </h4>

          {/* Summary Cards */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 rounded-lg mt-2 sm:mt-4">
            <div className="p-3 sm:p-4 rounded-lg bg-[#F2FFED] flex flex-col items-center gap-1 sm:gap-2">
              <p className="text-[#008D0E] text-[12px] sm:text-[14px] font-medium">
                Created
              </p>
              <p className="text-[#008D0E] text-[20px] sm:text-[24px] font-bold">
                {importSummary.created}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg bg-[#FFF7EA] flex flex-col items-center gap-1 sm:gap-2">
              <p className="text-[#B67C0C] text-[12px] sm:text-[14px] font-medium">
                Merged
              </p>
              <p className="text-[#B67C0C] text-[20px] sm:text-[24px] font-bold">
                {importSummary.merged}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg bg-[#FFEDED] flex flex-col items-center gap-1 sm:gap-2">
              <p className="text-[#C4494B] text-[12px] sm:text-[14px] font-medium">
                Skipped
              </p>
              <p className="text-[#C4494B] text-[20px] sm:text-[24px] font-bold">
                {importSummary.skipped}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
