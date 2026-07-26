import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("repositories")
      .select("*, profiles(username, display_name, avatar_url, github_username)")
      .eq("id", id)
      .eq("status", "active")
      .is("deleted_at", null)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, data: null, error: "Repository not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data, error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to fetch repository" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data: repoRaw } = await supabase.from("repositories").select("profile_id").eq("id", id).single();
    const repo = repoRaw as { profile_id: string } | null;
    if (!repo || repo.profile_id !== user.id) {
      return NextResponse.json({ success: false, data: null, error: "Forbidden" }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("repositories")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data, error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to update repository" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const { data: repoRaw } = await supabase.from("repositories").select("profile_id").eq("id", id).single();
    const repo = repoRaw as { profile_id: string } | null;
    if (!repo || repo.profile_id !== user.id) {
      return NextResponse.json({ success: false, data: null, error: "Forbidden" }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("repositories")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, data: null, error: null });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to delete repository" }, { status: 500 });
  }
}
