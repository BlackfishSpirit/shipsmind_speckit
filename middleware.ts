import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/solutions(.*)",
  "/case-studies(.*)",
  "/blog(.*)",
  "/contact",
  "/privacy",
  "/terms",
  "/api/webhooks(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    auth().protect();
  }

  // Redirect authenticated users away from auth pages and homepage
  if (auth().userId) {
    if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
      const returnUrl = req.nextUrl.searchParams.get('redirect_url') || '/dashboard';
      return NextResponse.redirect(new URL(returnUrl, req.url));
    }

    // Redirect authenticated users from homepage to dashboard
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Continue with the request
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};