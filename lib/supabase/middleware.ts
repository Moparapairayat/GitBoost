import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/auth/setup"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/auth/signin"];

export async function updateSession(request: NextRequest) {
  // Gracefully skip auth if Supabase is not yet configured (local dev before .env.local is set up)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Redirect unauthenticated users from protected routes
  if (!user && PROTECTED_ROUTES.some((r) => path.startsWith(r))) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signin";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && AUTH_ROUTES.some((r) => path.startsWith(r))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Admin route protection
  if (ADMIN_ROUTES.some((r) => path.startsWith(r))) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      return NextResponse.redirect(url);
    }
    // Role check happens inside admin layout via server component
  }

  return supabaseResponse;
}
