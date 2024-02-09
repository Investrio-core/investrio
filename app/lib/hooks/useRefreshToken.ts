"use client";

import { redirect } from "next/navigation";
import axios from "../axios";
import { useSession, signOut } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();
  const refreshToken = async () => {
    try { 
      console.log('here');
      const res = await axios.post("/user/refresh", {}, {withCredentials: true });
      console.log(res.data);

      const data = await res.data;

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