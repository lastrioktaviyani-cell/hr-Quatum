import { NextResponse, NextRequest } from "next/server";

// Middleware sederhana - hanya cek cookie "isLoggedIn" atau session token
// NextAuth middleware akan handle di route handler level
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and static assets
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // Cek apakah user sudah login (session cookie dari NextAuth)
  const sessionToken = request.cookies.get("next-auth.session-token") ||
                       request.cookies.get("__Secure-next-auth.session-token");

  const isLoggedIn = !!sessionToken;

  // Redirect unauthenticated users to login
  if (!isLoggedIn && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from login
  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
