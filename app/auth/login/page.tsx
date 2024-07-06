"use client";

import Image from "next/image";
import LoginForm from "@/app/auth/login/components/LoginForm";
import Link from "next/link";
import OnboardingIntroSteps from "@/app/components/OnboardingIntro/OnboardingIntroSteps";
import { useState } from "react";
export default function Login() {
  const [showSteps, setShowSteps] = useState(true);

  return (
    <div className="flex flex-col justify-center align-center">
      <Image
        src="/images/logo.svg"
        alt="Investrio"
        width={225}
        height={53}
        className="mx-auto pb-5 mt-[77px]"
      />

      {showSteps ? (
        <OnboardingIntroSteps
          showSteps={showSteps}
          setShowSteps={setShowSteps}
        />
      ) : (
        <div className="text-center p-5 mt-[30px]">
          <LoginForm />
          <p className="mt-[32px] text-base text-zinc-500">
            Don’t have an account?{" "}
            <Link href={"/auth/signup"} className="font-bold text-violet-600">
              Register Here
            </Link>
          </p>
          <div className="mt-[32px] text-[#6C7278] text-base absolute bottom-[24px] left-0 right-0 text-center">
            © 2024 Investrio. All rights reserved.
          </div>
        </div>
      )}
    </div>
  );
}
{
  /* <div className="text-base text-center text-slate-950 text-xl font-medium">
        Login to your account
      </div> */
}
{
  /* <div className="card bg-base-100 shadow p-5 text-center"> */
}
