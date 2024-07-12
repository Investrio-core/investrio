"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Mixpanel from "@/services/mixpanel";

const GoogleSignInButton = ({ callToAction }: { callToAction?: string }) => {
  const { data: session } = useSession();

  const auth = async () => {
    await signIn("google", {
      callbackUrl: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    });
  };
  if (session && session.user) {
    // text-sm md:text-base
    return (
      <div className="flex gap-4 ml-auto">
        <p className="text-sky-600">{session.user.name}</p>
        <button onClick={() => signOut()} className="text-red-600">
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={auth}
      className="btn btn-ghost w-full bg-[#F2F5F7] border-[#EAEAEA]"
      style={{
        borderRadius: "8px",
        background: "#FFF",
        boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.08)",
      }}
    >
      <span className="flex items-center capitalize text-slate-950 text-base font-medium">
        <img
          loading="lazy"
          height="24"
          width="24"
          id="provider-logo-dark"
          src="https://authjs.dev/img/providers/google.svg"
          className="w-5 h-5 mr-5"
        />
        {callToAction ?? "Login with Google"}
      </span>
    </button>
  );
};

export default GoogleSignInButton;
