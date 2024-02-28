"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const GoogleSignInButton = () => {
    const { data: session } = useSession();
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
        <button onClick={() => signIn("google")} className="btn btn-ghost w-full">
            <span className="flex items-center">
                <img loading="lazy" height="24" width="24" id="provider-logo-dark" src="https://authjs.dev/img/providers/google.svg" className="w-5 h-5 mr-5" />
                Access with Google
            </span>
        </button>
    );
};

export default GoogleSignInButton;