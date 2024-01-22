import React from "react";

export default function GoalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[600px] mx-auto">
      {children}
    </div>
  )
}