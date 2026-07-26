import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const { data: reviewRaw } = await supabase.from("reviews").select("profile_id").eq("id", id).single();
    const review = reviewRaw as { profile_id: string } | null;
    if (!review || review.profile_id !== user.id) {
      return NextResponse.json({ success: false, data: null, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("reviews")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data, error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const { data: reviewRaw } = await supabase.from("reviews").select("profile_id").eq("id", id).single();
    const review = reviewRaw as { profile_id: string } | null;
    if (!review || review.profile_id !== user.id) {
      return NextResponse.json({ success: false, data: null, error: "Forbidden" }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("reviews")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, data: null, error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to delete review" }, { status: 500 });
  }
}
