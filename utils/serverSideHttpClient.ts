import { cookies } from "next/headers";

export async function getServerSide(url: string) {
  try {
    const parsedUrl = url.startsWith("/") ? url: `/${url}`;
    const { accessToken } = JSON.parse(cookies().get('next-auth.user')?.value || "{}");

    const response = await fetch(`${process.env.NEXTAUTH_URL}${parsedUrl}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
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
