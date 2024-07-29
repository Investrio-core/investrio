import React from "react";

export default function DebtsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //  h-screen
    <div className="flex min-h-[91vh] justify-center items-center overflow-auto bg-violet-50">
      <div className="w-full flex justify-center items-center">
        <div>{children}</div>
      </div>
    </div>
  );
}
