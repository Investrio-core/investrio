"use client";

import Image from "next/image";
import LoginForm from "@/app/auth/login/components/LoginForm";
import Link from "next/link";
import OnboardingIntroSteps from "@/app/components/OnboardingIntro/OnboardingIntroSteps";
import { useState, useEffect } from "react";

export default function Login() {
  const [showSteps, setShowSteps] = useState<boolean>(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited === null) {
      setShowSteps(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  return (
    <div className="flex flex-col justify-center align-center overflow-auto">
      <Image
        src="/images/logo.svg"
        alt="Investrio"
        width={225}
        height={53}
        className="mx-auto size-64 mt-[-5rem]"
      />

      {showSteps ? (
        <OnboardingIntroSteps
          showSteps={showSteps}
          setShowSteps={setShowSteps}
        />
      ) : (
        <>
          <div className="text-center text-[#03091d] text-xl font-medium leading-[30px] tracking-wide mt-[-4rem]">
            Login first to your account
          </div>
          <div className="text-center p-[12px] mt-[30px]">
            <LoginForm />
            <p className="mt-[32px] text-base text-zinc-500 font-normal tracking-wide">
              Don't have an account?{" "}
              <Link href={"/auth/signup"} className="font-normal text-violet-600 ">
                Register Here
              </Link>
            </p>
            {/* <div className="mt-[32px] text-[#6C7278] text-base absolute bottom-[24px] left-0 right-0 text-center"> */}
            <div className="mt-[80px] text-[#6C7278] text-sm text-center">
              © 2024 Investrio. All rights reserved.
            </div>
          </div>
        </>
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
