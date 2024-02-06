'use client'
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/auth/login");

  // return (
  //   <div className="text-center">
  //     <h1 className="text-3xl font-bold underline">Investrio</h1>
  //     <Link className="btn" href='/auth/login'>Login</Link>
  //   </div>
  // );
}