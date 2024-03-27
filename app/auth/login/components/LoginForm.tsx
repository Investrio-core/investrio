"use client";

import { RxAvatar } from "react-icons/rx";
import { AiOutlineLock } from "react-icons/ai";
import { useRouter, useSearchParams } from "next/navigation";
import SigninButton from "@/app/components/ui/buttons/GoogleSignInButton";
import Form from "@/app/components/ui/Form";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { clearSession, saveSession } from "@/app/utils/session";
import Mixpanel from "@/services/mixpanel";

const LoginErrorsMapper = {
  OAuthCallback: {
    message: 'The sign in provider is returning an error. Please, try again later.'
  },
  OAuthSignin: {
    message: 'The sign in provider is not responding. Please, try again later.'
  }
} as Record<string, { message: string }>

export default function LoginForm() {
  const session = useSession();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get('error')) {
      setError(LoginErrorsMapper[params.get('error')!]?.message || 'Something went wrong!')
    }
  }, [params])

  useEffect(() => {
    if (session.status === "authenticated") {
      Mixpanel.getInstance().identify(session.data.user.id, session.data.user.email, session.data.user.name)
      Mixpanel.getInstance().track('login')
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
        router.push("/dashboard");
      } else {
        setError("Invalid Credentials");
      }
    } catch (err: any) {
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
    
      <Form onSubmit={onSubmit}>
        <div className="flex flex-col gap-5">
          <div className="form-control">
            <div className="join">
              <div className="btn join-item hover:cursor-default">
                <RxAvatar/>
              </div>
              <input
                type="email"
                required
                placeholder="Email"
                name="email"
                className="input input-bordered join-item w-full"
              />
            </div>
          </div>
          <div className="form-control">
            <div className="join ">
              <button className="btn join-item hover:cursor-default">
                <AiOutlineLock/>
              </button>
              <input
                type="password"
                required
                placeholder="Password"
                name="password"
                className="input input-bordered join-item w-full"
              />
            </div>
          </div>

          {error && <p className="text-left text-sm text-red-500">{error}</p>}

          <div className="form-control">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "LOG IN"}
            </button>
          </div>
        </div>
      </Form>
      <div className="divider">OR</div>
      <SigninButton/>
    </>
  );
}