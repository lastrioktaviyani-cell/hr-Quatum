import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Allow NextAuth API routes and static assets
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users away from login
  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
