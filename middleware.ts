import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/verify-email",
    "/terms",
    "/privacy",
  ]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Get auth token from cookies or headers
  const authToken =
    request.cookies.get("planly_auth_token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  // If accessing a protected route without auth token
  if (!isPublicRoute && !authToken) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing auth routes while authenticated
  if (isPublicRoute && authToken && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Check onboarding completion for dashboard access
  if (pathname.startsWith("/dashboard") && authToken) {
    const onboardingCompleted = request.cookies.get("planly_onboarding_completed")?.value

    if (!onboardingCompleted) {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
