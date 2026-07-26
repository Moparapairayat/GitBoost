import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { vote } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("review_votes")
      .upsert({ review_id: id, profile_id: user.id, vote }, { onConflict: "review_id,profile_id" });

    if (error) throw error;

    return NextResponse.json({ success: true, data: null, error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to vote" }, { status: 500 });
  }
}
