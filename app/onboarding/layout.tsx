import React from "react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center overflow-auto bg-violet-50">
      <div className="w-full max-w-[90%] md:max-w-lg">
        <div>{children}</div>
      </div>
    </div>
  );
}
