import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { event_type, repository_id, source, ip_hash, user_agent } = body;

    if (!event_type) {
      return NextResponse.json({ success: false, data: null, error: "event_type is required" }, { status: 400 });
    }

    const validEventTypes = ["profile_view", "repo_view", "github_click", "demo_click", "doc_click"];
    if (!validEventTypes.includes(event_type)) {
      return NextResponse.json({ success: false, data: null, error: "Invalid event_type" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("analytics_events")
      .insert({
        repository_id: repository_id ?? null,
        profile_id: user?.id ?? null,
        actor_id: user?.id ?? null,
        event_type,
        source: source ?? "web",
        ip_hash: ip_hash ?? null,
        user_agent: user_agent ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data, error: null }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to track event" }, { status: 500 });
  }
}
