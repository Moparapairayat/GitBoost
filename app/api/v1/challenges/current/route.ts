import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const now = new Date().toISOString();

    const { data: challenge, error } = await supabase
      .from("weekly_challenges")
      .select("*")
      .eq("is_active", true)
      .lte("starts_at", now)
      .gte("ends_at", now)
      .order("starts_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !challenge) {
      return NextResponse.json({ success: true, data: null, error: null });
    }

    const { data: completion } = await supabase
      .from("challenge_completions")
      .select("completed_at")
      .eq("profile_id", user.id)
      .eq("challenge_id", challenge.id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        ...challenge,
        is_completed: !!completion,
        completed_at: completion?.completed_at ?? null,
      },
      error: null,
    });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to fetch challenge" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { challenge_id } = body;

    if (!challenge_id) {
      return NextResponse.json({ success: false, data: null, error: "challenge_id is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("challenge_completions")
      .insert({
        profile_id: user.id,
        challenge_id,
      });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: false, data: null, error: "Challenge already completed" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data: null, error: null }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to complete challenge" }, { status: 500 });
  }
}
