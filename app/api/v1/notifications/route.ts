import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ success: true, data: notifications ?? [], error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("profile_id", user.id)
      .eq("is_read", false);

    if (error) throw error;

    return NextResponse.json({ success: true, data: null, error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to mark notifications as read" }, { status: 500 });
  }
}
