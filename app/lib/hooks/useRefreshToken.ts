"use client";

import { redirect } from "next/navigation";
import axios from "../axios";
import { signIn, useSession, signOut } from "next-auth/react";
import { getCookie } from "cookies-next";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();
  const refreshTokenValue = getCookie('refreshToken')

  const refreshToken = async () => {
    try { 
      const res = await axios.post("/user/refresh", {}, { withCredentials: true });

      if (!res.data.accessToken) {
        await signOut()
      }

      update({accessToken: res.data.accessToken})
      if (session) session.user.accessToken = res.data.accessToken;
      else redirect('/auth/login');
    } catch (err) {
      await signOut()
      redirect('/auth/login');
    }
  };
  return refreshToken;
};