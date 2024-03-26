import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.SECRET_KEY
  })

  let cookieName = 'next-auth.session-token';

  if (process.env.NODE_ENV === 'production') {
    cookieName = '__Secure-next-auth.session-token';
  }
  
  const sessionToken = cookies().get(cookieName)?.value;

  console.log(token);

  if ((!path.startsWith('/auth/login') && !path.startsWith('/auth/signup')) && !sessionToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  if ((!token?.isActive && !token?.isTrial) && sessionToken && !path.startsWith('/billing')) {
    return NextResponse.redirect(new URL('/billing', request.url));
  }
  if ((path.startsWith('/auth/login') || path.startsWith('/auth/signup')) && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  else {
    return  NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/dashboard/:path*",
    "/budget",
    '/billing'
  ],
};
