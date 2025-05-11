import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!token.isAdmin) {
      return NextResponse.redirect(new URL("/unauthorize", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/user")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
