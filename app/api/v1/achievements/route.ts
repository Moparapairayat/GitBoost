import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: achievements, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("is_active", true)
      .order("rarity", { ascending: true })
      .order("xp_reward", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: achievements ?? [], error: null });
  } catch {
    return NextResponse.json({ success: false, data: [], error: "Failed to fetch achievements" }, { status: 500 });
  }
}
