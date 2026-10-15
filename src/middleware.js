/**
 * @file src/middleware.js
 * @description Next.js App Router edge middleware for protecting /admin routes.
 * Ensures unauthenticated visitors cannot access admin areas, refreshes session
 * cookies, and prevents redirect loops.
 */

import { NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Refresh Supabase session cookies and retrieve authenticated user
  const { supabaseResponse, user } = await updateSession(request);

  const isLoginPage = pathname === '/admin/login';
  const isAdminRoute = pathname.startsWith('/admin');

  // Check single-owner authorization if ADMIN_EMAIL is set
  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const isAuthorized =
    Boolean(user) &&
    (!configuredAdminEmail || user.email?.toLowerCase() === configuredAdminEmail);

  // If already authenticated and authorized, redirect away from /admin/login to /admin
  if (isLoginPage) {
    if (isAuthorized) {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
    return supabaseResponse;
  }

  // If attempting to access any protected /admin route without valid auth, redirect to /admin/login
  if (isAdminRoute && !isAuthorized) {
    const loginUrl = new URL('/admin/login', request.url);
    // Optional: preserve intended destination for post-login redirect
    if (pathname !== '/admin') {
      loginUrl.searchParams.set('redirectTo', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all /admin routes only.
     * Public portfolio routes (/, /about, /skills, /projects, /contact, /images)
     * are completely excluded and freely accessible.
     */
    '/admin/:path*',
  ],
};
