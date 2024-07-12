"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button className="btn bg-white capitalize" onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
