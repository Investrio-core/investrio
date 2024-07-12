"use client";

import Form from "@/app/components/ui/Form";
import Input from "@/app/components/ui/Input";
import { Button, LightButton, SimpleButton } from "@/app/components/ui/buttons";
import SigninButton from "@/app/components/ui/buttons/GoogleSignInButton";
import Link from "next/link";
import { RxInfoCircled } from "react-icons/rx";

interface Props {
  onSubmit: (data: { name: string; email: string; password: string }) => void;
  error: string;
  isLoading: boolean;
  setShowSteps: Function;
}

export default function SignupForm({
  onSubmit,
  isLoading,
  error,
  setShowSteps,
}: Props) {
  return (
    <>
      <RxInfoCircled
        cursor="pointer"
        fontSize="28px"
        className="text-violet-600 font-bold absolute top-4 right-4"
        onClick={() => setShowSteps(true)}
      />
      <div className="text-center mb-[16px]">
        <h1 className="mb-2 text-base/[22px] font-xl font-semibold tracking-widest">
          Complete Your Profile
        </h1>
        <p className="text-slate-400 text-base/[14px] px-8 leading-normal">
          For the purpose of industry regulation, your details are required.
        </p>
      </div>

      <SigninButton callToAction={"Register with Google"} />
      <div className="divider text-xs">OR</div>

      <Form onSubmit={onSubmit}>
        <Input
          label="Your Full Name*"
          name="name"
          required
          placeholder="Enter your full name"
        />
        <Input
          label="Email address"
          name="email"
          required
          placeholder="Enter your email address"
          type="email"
        />
        <Input
          label="Create password"
          name="password"
          required
          placeholder="Enter your password"
          type="password"
        />

        {error && <p className="text-left text-sm text-red-500">{error}</p>}

        {/* <div className="form-control w-fit mt-4">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="checkbox checkbox-primary mr-2"
            />
            <span className="label-text">I agree to terms & conditions</span>
          </label>
        </div> */}

        <div className="w-fit mt-4">
          {/* text-base/[12px] leading-normal */}
          <p className="label-text">
            By creating an account you accept Investrio's&nbsp;
            <Link
              href={"/auth/signup"}
              className="font-bold text-violet-600"
              style={{ whiteSpace: "pre" }}
            >
              E-Communication Policy
            </Link>
            ,{" "}
            <Link href={"/auth/signup"} className="font-bold text-violet-600">
              Terms and Conditions
            </Link>
            ,{" "}
            <Link href={"/auth/signup"} className="font-bold text-violet-600">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href={"/auth/signup"} className="font-bold text-violet-600">
              Privacy Disclosure
            </Link>
            .
          </p>
        </div>

        <button
          className="btn btn-primary mt-4 w-full capitalize text-base/[16px]"
          type="submit"
          disabled={isLoading}
          style={{
            borderRadius: "12px",
          }}
        >
          {isLoading ? "Loading..." : "Register Account"}
        </button>
      </Form>
      <p className="mt-5 text-center text-base">
        Already have an account?{" "}
        <Link href={"/auth/login"} className="font-bold text-violet-600">
          Sign in
        </Link>
      </p>
      <div className="mt-[32px] text-[#6C7278] text-base text-center pb-2 mb-2">
        © 2024 Investrio. All rights reserved.
      </div>
    </>
  );
}
