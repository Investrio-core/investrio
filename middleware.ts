import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  let cookieName = 'next-auth.session-token';

  if (process.env.ENV === 'production') {
    cookieName = '__Secure-next-auth.session-token';
  }
  
  const sessionToken = cookies().get(cookieName)?.value;

  if (path.startsWith('/dashboard') && sessionToken) {
    return NextResponse.next();
  } else if (!path.startsWith('/dashboard') && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } else if (path.startsWith('/dashboard') && !sessionToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/dashboard/:path*"
  ],
};
