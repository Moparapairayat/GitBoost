import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "[GitBoost] Supabase is not configured. Please copy .env.local.example to .env.local and fill in your Supabase project URL and anon key."
    );
  }

  return createBrowserClient<Database>(url, key);
}
