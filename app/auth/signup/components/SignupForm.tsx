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
  setShowSteps
}: Props) {
  return (
    <>
      <div className="text-center mb-[40px] mt-[-4rem]">
        <h1 className="mb-2 font-medium tracking-wider [font-family:'Poppins',Helvetica] text-xl relative">
          Complete Your Profile
        </h1>
        <p className="text-[#858699] font-thin [font-family:'Poppins',Helvetica] text-base w-9/12 mx-auto tracking-[0]">
          For the purpose of industry regulation, your details are required.
        </p>
      </div>

      <Form onSubmit={onSubmit}>
        <div className="mb-5">
          <Input
            label="Your Full Name*"
            name="name"
            required
            placeholder="Name"
          />
        </div>
        <div className="mb-5">
          <Input
            label="E-mail address"
            name="email"
            required
            placeholder="E-mail"
            type="email"
          />
        </div>
        <div className="mb-5">
          <Input
            label="Create password"
            name="password"
            required
            placeholder="Password"
            type="password"
          />
        </div>

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

        <div className="w-fit mt-4 mb-5">
          {/* text-base/[12px] leading-normal */}
          <p className="text-slate-400 label-text tracking-[0] leading-relaxed [font-family:'Poppins',Helvetica] w-11/12 font-thin text-base">
            By creating an account you accept Investrio&nbsp;
            <br />
            <Link
              href={"/auth/signup"}
              className="underline text-[#8833ff]"
              style={{ whiteSpace: "pre" }}
            >
              E-Communication Policy
            </Link>
            ,{" "}
            <Link href={"/auth/signup"} className="underline text-[#8833ff]">
              Terms and Conditions
            </Link>
            ,{" "}
            <Link href={"/auth/signup"} className="underline text-[#8833ff]">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href={"/auth/signup"} className="underline text-[#8833ff]">
              Privacy Disclosure
            </Link>
            .
          </p>
        </div>

        <button
          className="btn btn-primary mt-4 w-full capitalize text-base/[16px] text-white bottom-0"
          type="submit"
          disabled={isLoading}
          style={{
            borderRadius: "12px",
          }}
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </Form>
      {/* <p className="mt-5 text-center text-base">
        Already have an account?{" "}
        <Link href={"/auth/login"} className="font-bold text-violet-600">
          Sign in
        </Link>
      </p> */}
    </>
  );
}
