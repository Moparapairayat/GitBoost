import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

import type { Database } from "@/types/database.types";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("bio, skills, experience_years")
          .eq("id", user.id)
          .single();

        const profileData = profile as Pick<Database["public"]["Tables"]["profiles"]["Row"], "bio" | "skills" | "experience_years"> | null;
        const isProfileComplete = profileData?.bio && profileData?.skills && profileData.skills.length > 0;
        if (!isProfileComplete) {
          return NextResponse.redirect(`${origin}/auth/setup`);
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/signin?error=auth_error`);
}
