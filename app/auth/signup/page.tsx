"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Mixpanel from "@/services/mixpanel";
import Image from "next/image";
import SignupForm from "./components/SignupForm";
import OnboardingIntroSteps from "@/app/components/OnboardingIntro/OnboardingIntroSteps";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSteps, setShowSteps] = useState(true);

  async function onSubmit(data: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      if (data.password.length < 8) {
        setError("Your password must be at least 8 characters long.");
        return;
      }

      setIsLoading(true);
      setError("");
      const user = await axios.post(
        `${API_URL}/user/signup`,
        { ...data, type: "credentials" },
        { withCredentials: true }
      );

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        // ## Register callback:
        callbackUrl: "/dashboard/debts/add",
      });

      Mixpanel.getInstance().identify(user.data.id, data.email, data.name);
      Mixpanel.getInstance().track("registration");
    } catch (err: AxiosError | any) {
      console.log(err.message);
      setError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Image
        src="/images/logo.svg"
        alt="Investrio"
        width={225}
        height={53}
        className={`mx-auto pb-[12px] ${showSteps ? "mt-[0px]" : "mt-[42px]"}`}
      />
      {showSteps ? (
        <OnboardingIntroSteps
          showSteps={showSteps}
          setShowSteps={setShowSteps}
        />
      ) : (
        <SignupForm
          isLoading={isLoading}
          error={error}
          onSubmit={onSubmit}
          setShowSteps={setShowSteps}
        />
      )}
    </>
  );
}

// Stripped out select individual or company page:
/*
import { RxAvatar } from "react-icons/rx";
import { BsArrowRight } from "react-icons/bs";
import { MdOutlineBusiness } from "react-icons/md";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="mx-auto flex max-w-[90%] flex-col md:max-w-[600px]">
      <div className="mb-5">
        <h1 className="text-3xl font-bold">Join Us!</h1>
        <p className="text-slate-400">
          To begin this journey, tell us what type of account you’d be opening.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Link
          href={"/auth/signup/individual/1"}
          className="group transition duration-500"
        >
          <div className="card group-hover:shadow-0 group-hover:bg-primary/10 group-hover:border-primary rounded p-5 shadow group-hover:cursor-pointer group-hover:border">
            <div className="flex items-center gap-5">
              <RxAvatar
                className="mask mask-pentagon group-hover:bg-primary text-primary border p-4 shadow transition group-hover:text-white"
                size={60}
              />
              <div>
                <h2 className="card-title">Individual</h2>
                <p className="text-slate-400">
                  Personal account to manage all you activities.
                </p>
              </div>
              <div>
                <BsArrowRight className="group-hover:text-primary text-slate-300" />
              </div>
            </div>
          </div>
        </Link>

        <div className="group transition-all duration-500">
          <div className="card group-hover:shadow-0 group-hover:bg-primary/10 group-hover:border-primary rounded p-5 shadow group-hover:cursor-not-allowed group-hover:border">
            <div className="flex items-center gap-5">
              <MdOutlineBusiness
                className="mask mask-pentagon group-hover:bg-primary text-primary border p-4 shadow transition group-hover:text-white"
                size={60}
              />
              <div>
                <h2 className="card-title">
                  Small Business Owner (Coming Soon)
                </h2>
                <p className="text-slate-400">
                  Own or belong to a company, this is for you.
                </p>
              </div>
              <div>
                <BsArrowRight className="group-hover:text-primary text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-5 text-center text-base ">Already have an account? <Link href={"/auth/login"} className="font-bold text-purple-1">Sign in</Link></p>
      <div className="color-gray-200 text-[#6C7278] text-center text-base mt-5">
          For the best Investrio experience, we suggest using a desktop.<br/> Good
          news: our mobile version is on its way!
        </div>
    </div>
  );
}
*/
