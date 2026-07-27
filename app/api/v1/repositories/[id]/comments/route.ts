import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("comments")
      .select("id, body, is_edited, created_at, updated_at, profile_id, parent_id, profiles!repositories_profile_id_fkey(username, display_name, avatar_url)", { count: "exact" })
      .eq("repository_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? [], meta: { total: data?.length ?? 0 }, error: null });
  } catch {
    return NextResponse.json({ success: false, data: [], meta: { total: 0 }, error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { body: commentBody, parent_id } = body;

    if (!commentBody) {
      return NextResponse.json({ success: false, data: null, error: "Comment body is required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("comments")
      .insert({
        repository_id: id,
        profile_id: user.id,
        body: commentBody,
        parent_id: parent_id ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data, error: null }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to create comment" }, { status: 500 });
  }
}
