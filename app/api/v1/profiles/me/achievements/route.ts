import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const { data: userAchievements, error } = await supabase
      .from("profile_achievements")
      .select("achievement_id, earned_at, achievements(code, name, description, icon, xp_reward, rarity)")
      .eq("profile_id", user.id)
      .order("earned_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: userAchievements ?? [], error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to fetch user achievements" }, { status: 500 });
  }
}
