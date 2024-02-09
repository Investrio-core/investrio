"use client";

import { redirect } from "next/navigation";
import axios from "../axios";
import { useSession, signOut } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();
  const refreshToken = async () => {
    try { 
      const res = await fetch("/api/user/refresh", {credentials: 'include', method: "POST" });

      const data = await res.json();

      if (!data.accessToken) {
        signOut()
      }

      
      if (session) update({accessToken: data.accessToken})
      else redirect('/auth/login');
    } catch (err) {
      console.log(err);
      await signOut()
      redirect('/auth/login');
    }
  };
  return refreshToken;
};