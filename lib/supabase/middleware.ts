import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/database.types';
import { getSupabaseConfig } from './config';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { url, anonKey } = getSupabaseConfig();

  const supabase = createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protected Admin Routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!user && process.env.NODE_ENV === 'production') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Auto-redirect if already logged in as Admin
  if (pathname === '/admin/login' && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // Protected Rider Routes
  if (pathname.startsWith('/rider') && !pathname.startsWith('/rider/login')) {
    if (!user && process.env.NODE_ENV === 'production') {
      const url = request.nextUrl.clone();
      url.pathname = '/rider/login';
      url.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Auto-redirect if already logged in as Rider
  if (pathname === '/rider/login' && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/rider';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
