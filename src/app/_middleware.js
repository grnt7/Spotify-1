/*import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  // Define routes that should always be accessible
  const publicRoutes = ["/", "/login"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Routes that are part of the NextAuth.js flow and should always be allowed
  const nextAuthRoutes = ["/api/auth/session", "/api/auth/providers", "/api/auth/csrf", "/api/auth/signin", "/api/auth/callback"];
  const isNextAuthRoute = nextAuthRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute || isNextAuthRoute || token) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and trying to access a protected route
  if (!token && !isPublicRoute && !isNextAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// Optional: Define matcher to only run on specific paths if needed
// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };

*/














/*
papa original build code

import {getToken} from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET})

    const {pathname} = req.nextUrl

//ALLOW THE REQUEST if the following is true..
// 1) Its a request for next-auth session & provider fethching
// 2) the token exists
if (pathname.includes("api/auth") || token ) {
    return NextResponse.next();
}
}

// Redirect them to login if they don't have token and are requesting a protected route

if(!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
}

*/
