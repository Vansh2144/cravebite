import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPage = pathname.startsWith("/dashboard") || pathname.startsWith("/checkout");

  if (token) {
    // Logged in users shouldn't access login/register
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // Unauthenticated users shouldn't access dashboard/checkout
    if (isDashboardPage) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/login", "/register"],
};
