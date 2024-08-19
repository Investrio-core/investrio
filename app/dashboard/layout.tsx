import React from "react";
import { backgroundColor } from "@/app/utils/constants";

export default function DebtsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //  h-screen
    // <div className="flex min-h-[91vh] justify-center items-center overflow-auto bg-violet-50"></div>
    <div className={`flex min-h-[91vh] overflow-auto ${backgroundColor}`}>
      <div className="w-full flex">
        <div className="w-full flex">{children}</div>
      </div>
    </div>
  );
}
