import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") ?? "helpful";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const supabase = await createClient();
    let query = supabase
      .from("reviews")
      .select("id, rating_overall, rating_code, rating_docs, rating_perf, rating_ui, rating_arch, pros, cons, suggestions, body, helpful_count, created_at, profile_id, profiles(username, display_name, avatar_url)", { count: "exact" })
      .eq("repository_id", id)
      .is("deleted_at", null);

    if (sort === "helpful") {
      query = query.order("helpful_count", { ascending: false }).order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? [], meta: { page, limit, total: count ?? 0 }, error: null });
  } catch {
    return NextResponse.json({ success: false, data: [], meta: { page: 1, limit: 10, total: 0 }, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { rating_overall, rating_code, rating_docs, rating_perf, rating_ui, rating_arch, pros, cons, suggestions, body: reviewBody } = body;

    if (!rating_overall) {
      return NextResponse.json({ success: false, data: null, error: "Overall rating is required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("reviews")
      .insert({
        repository_id: id,
        profile_id: user.id,
        rating_overall,
        rating_code,
        rating_docs,
        rating_perf,
        rating_ui,
        rating_arch,
        pros,
        cons,
        suggestions,
        body: reviewBody,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data, error: null }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to create review" }, { status: 500 });
  }
}
