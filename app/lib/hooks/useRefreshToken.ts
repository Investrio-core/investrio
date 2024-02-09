"use client";

import { redirect } from "next/navigation";
import axios from "../axios";
import { useSession, signOut } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();
  const refreshToken = async () => {
    try { 
      console.log('here');
      const res = await fetch("/api/user/refresh", {credentials: 'include', method: "POST" });
      console.log(res.ok);

      const data = await res.json();

      // if (!data.accessToken) {
        // signOut()
      // }
      console.log(data);

      update({accessToken: data.accessToken})
      if (session) session.user.accessToken = data.accessToken;
      // else redirect('/auth/login');
    } catch (err) {
      console.log(err);
      // await signOut()
      // redirect('/auth/login');
    }
  };
  return refreshToken;
};