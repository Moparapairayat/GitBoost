import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const { data: commentRaw } = await supabase.from("comments").select("profile_id").eq("id", id).single();
    const comment = commentRaw as { profile_id: string } | null;
    if (!comment || comment.profile_id !== user.id) {
      return NextResponse.json({ success: false, data: null, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("comments")
      .update({ ...body, is_edited: true, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data, error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to update comment" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const { data: commentRaw } = await supabase.from("comments").select("profile_id").eq("id", id).single();
    const comment = commentRaw as { profile_id: string } | null;
    if (!comment || comment.profile_id !== user.id) {
      return NextResponse.json({ success: false, data: null, error: "Forbidden" }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("comments")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, data: null, error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to delete comment" }, { status: 500 });
  }
}
