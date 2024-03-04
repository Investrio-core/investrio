import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  let cookieName = 'next-auth.session-token';

  if (process.env.NODE_ENV === 'production') {
    cookieName = '__Secure-next-auth.session-token';
  }
  
  const sessionToken = cookies().get(cookieName)?.value;

  if ((!path.startsWith('/auth/login') && !path.startsWith('/auth/signup')) && !sessionToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/dashboard/:path*",
    "/budget",
  ],
};
