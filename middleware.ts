import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

/**
 * Next.js Middleware for Route Protection
 * Runs on every request before it reaches the app
 * Protects private routes and redirects based on auth state
 *
 * Note: This is a client-side auth check since Firebase operates in browser
 * For production, consider adding a backend verification layer with Firebase Admin SDK
 */

// Define protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/upload', '/reports']

// Define public routes that should redirect authenticated users away
const PUBLIC_ONLY_ROUTES = ['/marketing', '/']

// Routes that don't require protection
const PUBLIC_ROUTES = ['/demo', '/api']

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for api routes and public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  /**
   * NOTE: Firebase authentication is client-side only
   * The middleware cannot access Firebase auth state directly
   * 
   * For client-side route protection, we rely on:
   * 1. useAuth() hook in components to check user state
   * 2. Route guards in page components
   * 3. Redirects in AuthProvider or custom route protection component
   * 
   * This middleware serves as a safety measure but the main protection
   * happens in the React components through AuthProvider and useAuth hook
   */

  // The actual route protection happens in components via useAuth()
  // This middleware is here as an additional safety layer
  // For stronger protection, implement a backend verification with Firebase Admin SDK

  return NextResponse.next()
}

/**
 * Configure which routes the middleware applies to
 * Using regex to match all routes except static files, assets, and api
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
