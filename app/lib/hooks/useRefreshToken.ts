"use client";

import { redirect } from "next/navigation";
import axios from "../axios";
import { signIn, useSession, signOut } from "next-auth/react";
import { getCookies } from "cookies-next";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
console.log(BASE_URL);

export const useRefreshToken = () => {
  const { data: session, update } = useSession();

  const refreshToken = async () => {
    try { 
      const res = await fetch(`${BASE_URL}/user/refresh`, { credentials: 'include', method: "POST"});

      const token = await res.json() as any


      console.log(token);

      if (!token.accessToken) {
        // await signOut()
        return 
      }

      update({accessToken: token.accessToken.accessToken})
      if (session) session.user.accessToken = token.accessToken.accessToken;
      else redirect('/auth/login');
    } catch (err) {
      await signOut()
      redirect('/auth/login');
    }
  };
  return refreshToken;
};