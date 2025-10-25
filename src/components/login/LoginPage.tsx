"use client";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
