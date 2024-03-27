"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Mixpanel from "@/services/mixpanel";

const GoogleSignInButton = () => {
    const { data: session } = useSession();

    const auth = async () => {
      await signIn('google', {callbackUrl: 'http://localhost:3000/dashboard?success=true'},)
    }
    if (session && session.user) {
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
        <button onClick={auth} className="btn btn-ghost w-full bg-[#F2F5F7] border-[#EAEAEA]">
            <span className="flex items-center">
                <img loading="lazy" height="24" width="24" id="provider-logo-dark" src="https://authjs.dev/img/providers/google.svg" className="w-5 h-5 mr-5" />
                Access with Google
            </span>
        </button>
    );
};

export default GoogleSignInButton;