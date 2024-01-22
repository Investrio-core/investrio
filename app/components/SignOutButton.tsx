'use client';
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button className="btn bg-white" onClick={() => signOut()}>
      Sign Out
    </button>
  )
}