import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignInClient from "./SignInClient";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) redirect("/dashboard");
    }
  } catch {
    // Supabase not configured yet
  }

  const params = await searchParams;
  return <SignInClient redirectTo={params.redirectTo} error={params.error} />;
}
