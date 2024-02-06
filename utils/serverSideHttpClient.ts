import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";


export async function getServerSide(url: string) {
  try {
    const parsedUrl = url.startsWith("/") ? url: `/${url}`;
    const { accessToken } = JSON.parse(cookies().get('next-auth.user')?.value || "{}");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${parsedUrl}`, {
      headers: {
        credentials: 'include',
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching data!")
    }

    return await response.json();
  } catch (e) {
    console.error({ e });
    return Promise.reject(e);
  }
}
