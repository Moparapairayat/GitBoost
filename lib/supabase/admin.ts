import { createClient as createAdminClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Admin client with service role — NEVER expose to client
export const supabaseAdmin = createAdminClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
