import { getCookie } from "@/utils/session";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { config } from "process";
import { getToken } from "next-auth/jwt";

export async function get(url: string) {
  try {
    const parsedUrl = `/${url.startsWith("/") ? url.substring(1) : url}`;

    if (typeof document === "undefined") {
      return Promise.reject(new Error("Document is not defined"));
    }

    const { accessToken } = JSON.parse(
      getCookie(document.cookie, "next-auth.user") || "{}"
    );

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${parsedUrl}`, {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      // Clears cookies (after this, the middleware will trigger a redirect to the login page)
      toast.warning("Your session expired. Please, sign in again.")
      // signOut();
    }

    return response.json();
  } catch (e) {
    console.error({ e });
    return Promise.reject(e);
  }
}

export async function post(url: string, data?: any) {
  try {
    const parsedUrl = url.startsWith("/") ? url : `/${url}`;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${parsedUrl}`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(getCookie(document.cookie, "next-auth.user"))
          .accessToken}`,
      },
      body: JSON.stringify(data),
    });

    console.log(response.ok);

    if (response.status === 401) {
      // Clears cookies (after this, the middleware will trigger a redirect to the login page)
      toast.warning("Your session expired. Please, sign in again.")
      // signOut();
    }

    const jsonResponse = await response.json();
    console.log(jsonResponse);

    if (!response.ok) {
      return Promise.reject(jsonResponse.error || "Something went wrong");
    }

    return Promise.resolve(jsonResponse);
  } catch (e) {
    console.error({ e });
    return Promise.reject(e);
  }
}
