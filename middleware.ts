import { NextRequest, NextResponse } from "next/server";

const AUTH_ONLY_PATHS = ["/login", "/register"];

// Only these paths require a session
const PROTECTED_PATHS = ["/encounter", "/encounters", "/create", "/account"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("enc_session");

  // Redirect logged-in users away from login/register
  if (AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p)) && session) {
    return NextResponse.redirect(new URL("/browse", req.url));
  }

  // Only protect encounter, create, and account routes
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
