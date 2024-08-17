import React from "react";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //  h-screen
    <div className="flex min-h-screen justify-center items-center overflow-auto bg-white">
      <div className="w-full max-w-[90%] md:max-w-lg">
        <div>{children}</div>
      </div>
    </div>
  );
}

// Stripped out select individual or company step and steps
/*
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AiOutlineArrowLeft } from "react-icons/ai";

const steps: Record<string, any> = {
  "/auth/signup/individual/1": {
    title: "Complete Your Profile!",
    description:
      "For the purpose of industry regulation, your details are required.",
    back: "/auth/login/",
    step: 1,
    stepTitle: "Personal Info",
  },
  "/auth/signup/checkout/2": {
    title: "Thank you for subscribing!",
    description: "An email confirmation has been sent your email address.",
    step: 2,
    stepTitle: "Welcome",
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="mx-auto w-full max-w-[90%]">
        <div className="h-[80px] pt-10">
          {steps[pathname] && (
            <div className="flex justify-between">
              {steps[pathname].back && (
                <Link
                  href={steps[pathname].back}
                  className="flex items-center gap-2 text-xs text-slate-400"
                >
                  <AiOutlineArrowLeft /> Back
                </Link>
              )}

              <div className="ml-auto flex flex-col text-right">
                <div className="text-xs text-slate-400">
                  STEP {String(steps[pathname].step).padStart(2, "0")}/02
                </div>
                <div className="text-sm font-semibold text-slate-500">
                  {steps[pathname].stepTitle}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-3">
          {steps[pathname] && (
            <div className="text-center">
              <h1 className="mb-2 text-3xl font-bold">
                {steps[pathname].title}
              </h1>
              <p className="text-slate-400">{steps[pathname].description}</p>
            </div>
          )}

          <div className="mx-auto w-full">{children}</div>
        </div>
      </div>
    </>
  );
}
*/
