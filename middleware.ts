import { NextRequest, NextResponse } from "next/server";

const AUTH_ONLY_PATHS = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("enc_session");

  // Redirect logged-in users away from login/register
  if (AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p)) && session) {
    return NextResponse.redirect(new URL("/browse", req.url));
  }

  // Protect app routes
  const isPublic =
    pathname === "/" ||
    AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (!isPublic && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
