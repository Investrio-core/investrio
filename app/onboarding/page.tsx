"use client";

import Image from "next/image";
import { StandardButton } from "@/app/components/ui/buttons";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col max-h-[100%]">
      <Image
        src="/images/logo.svg"
        alt="Investrio"
        width={225}
        height={53}
        className={`mx-auto pb-5 flex-start mb-[28px] mt-[34px]`}
      />
      <div className="text-center mb-[28px]">
        <h1 className="mb-2 text-3xl font-bold tracking-widest">
          Tell us about yourself
        </h1>
      </div>
      <div className="flex flex-col gap-[12px]">
        <StandardButton
          classProp="normal-case"
          text={"I want to be debt free"}
          onClick={() => {}}
        />
        <StandardButton
          classProp="normal-case"
          text={"I am ready to invest"}
          onClick={() => {}}
        />
        <StandardButton
          classProp="normal-case"
          text={"I want to build a plan"}
          onClick={() => {}}
        />
        <StandardButton
          classProp="normal-case"
          text={"I’d like to meet an advisor"}
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
