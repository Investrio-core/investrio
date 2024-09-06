import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const params = request.nextUrl.searchParams;

  // TODO: check if token has expired?
  // - weird next-auth bug
  const token = await getToken({
    req: request,
    secret: process.env.SECRET_KEY,
  });

  let cookieName = "next-auth.session-token";

  if (process.env.NODE_ENV === "production") {
    cookieName = "__Secure-next-auth.session-token";
  }

  const sessionToken = cookies().get(cookieName)?.value;

  if (
    !path.startsWith("/auth/login") &&
    !path.startsWith("/auth/signup") &&
    !sessionToken
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (path.startsWith("/settings") && params.has("success") && sessionToken) {
    return NextResponse.next();
  }

  // if ((token?.isShowPaywall) && sessionToken && !path.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  // if (!path.includes('/dashboard') && !token?.isAddedFreeStrategy && sessionToken) {
  //   return NextResponse.redirect(new URL('/dashboard/debts/add', request.url));
  // }

  // if (
  //   (path.startsWith("/auth/login") || path.startsWith("/auth/signup")) &&
  //   sessionToken
  // ) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // } else {
  //   return NextResponse.next();
  // }

  // if (path.startsWith("/auth/login") && sessionToken) {
  //   // return NextResponse.redirect(new URL("/dashboard", request.url));
  //   // return NextResponse.redirect(new URL("/auth/signup/completion", request.url));
  //   return NextResponse.next();
  // } else {
  //   return NextResponse.next();
  // }
  return NextResponse.next();

}

export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*", "/budget", "/settings", "/profile"],
};
