import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const today = new Date().toISOString().split("T")[0];

    const { data: missions, error } = await supabase
      .from("daily_missions")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const { data: completions } = await supabase
      .from("mission_completions")
      .select("mission_id, completed_date")
      .eq("profile_id", user.id)
      .gte("completed_date", today);

    const completedToday = new Set(completions?.map((c) => c.mission_id) ?? []);

    const missionsWithProgress = missions?.map((mission) => {
      const isCompleted = completedToday.has(mission.id);
      return {
        ...mission,
        is_completed: isCompleted,
        progress: isCompleted ? mission.action_count : 0,
      };
    }) ?? [];

    return NextResponse.json({ success: true, data: missionsWithProgress, error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to fetch missions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { mission_id } = body;

    if (!mission_id) {
      return NextResponse.json({ success: false, data: null, error: "mission_id is required" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("mission_completions")
      .insert({
        profile_id: user.id,
        mission_id,
        completed_date: today,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: false, data: null, error: "Mission already completed today" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data, error: null }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to complete mission" }, { status: 500 });
  }
}
