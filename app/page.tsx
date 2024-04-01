'use client'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Loading } from "./components/ui/Loading";

export default function Page() {
  redirect("/auth/login");
}