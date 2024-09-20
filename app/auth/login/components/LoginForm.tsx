"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SigninButton from "@/app/components/ui/buttons/GoogleSignInButton";
import Form from "@/app/components/ui/Form";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { clearSession } from "@/app/utils/session";
import Mixpanel from "@/services/mixpanel";
import Link from "next/link";
import Input from "@/app/components/ui/Input";
// import { HOME_DASHBOARD_PAGE } from "@/app/utils/constants";

const LoginErrorsMapper = {
  OAuthCallback: {
    message:
      "The sign in provider is returning an error. Please, try again later.",
  },
  OAuthSignin: {
    message: "The sign in provider is not responding. Please, try again later.",
  },
} as Record<string, { message: string }>;

export default function LoginForm() {
  const session = useSession();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("error")) {
      setError(
        LoginErrorsMapper[params.get("error")!]?.message ||
        "Something went wrong!"
      );
    }
  }, [params]);

  useEffect(() => {
    if (session.status === "authenticated") {
      Mixpanel.getInstance().identify(
        session.data.user.id,
        session.data.user.email,
        session.data.user.name
      );
      Mixpanel.getInstance().track("login");
    } else {
      clearSession();
    }
  }, [session]);

  async function onSubmit(data: { email: string; password: string }) {
    try {
      setIsLoading(true);
      setError("");
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.ok) {
        router.push("/auth/signup/completion");
        // router.push(HOME_DASHBOARD_PAGE);
      } else {
        setError("Invalid Credentials");
      }
    } catch (err: any) {
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  function forgetPasswordHandler() {
    sessionStorage.setItem('userData', JSON.stringify({ type: "passwordReset" }))
    router.push('/auth/verification');
  }

  return (
    <>
      <SigninButton />
      <div className="divider mt-8 text-sm">Or</div>
      <Form onSubmit={onSubmit}>
        <div className="flex flex-col gap-5 mt-7">
          <div className="mb-2">
            <Input
              label="Email"
              name="email"
              required
              placeholder="E-mail"
              type="email"
              labelStyles={"text-xs"}
            />
          </div>
          <div className="mb-[-1rem]">
            <Input
              label="Password"
              name="password"
              required
              placeholder="Password"
              type="password"
              labelStyles={"text-xs"}
            />
          </div>

          <div className="mt-[5px] text-base text-right">
            <button
              // href={"/auth/reset-password"}
              onClick={forgetPasswordHandler}
              className="font-light text-violet-600"
            >
              Forgot Password
            </button>
          </div>

          {error && <p className="text-left text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary capitalize text-base/[16px] text-white mt-6"
            disabled={isLoading}
            style={{
              borderRadius: "12px",
            }}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </div>
      </Form>
    </>
  );
}
