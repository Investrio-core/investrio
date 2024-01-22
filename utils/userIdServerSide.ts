import { cookies } from "next/headers";

export const getServerSideUserId = (): string => {
  const user = JSON.parse(cookies().get("next-auth.user")?.value || "{}");
  return user?.id || ""
}