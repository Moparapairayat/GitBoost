import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const sort = searchParams.get("sort") ?? "latest";
    const category = searchParams.get("category");
    const language = searchParams.get("language");
    const framework = searchParams.get("framework");
    const search = searchParams.get("q");

    const supabase = await createClient();
    let query = supabase
      .from("repositories")
      .select("id, title, description, language, github_stars, github_forks, view_count, trending_score, created_at, profile_id, profiles(username, display_name, avatar_url)", { count: "exact" })
      .eq("status", "active")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (category) query = query.eq("category_id", category);
    if (language) query = query.eq("language", language);
    if (framework) query = query.eq("framework_id", framework);
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (sort === "trending") {
      query = query.order("trending_score", { ascending: false });
    } else if (sort === "popular") {
      query = query.order("view_count", { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data ?? [],
      meta: { page, limit, total: count ?? 0 },
      error: null,
    });
  } catch {
    return NextResponse.json({ success: false, data: [], meta: { page: 1, limit: 20, total: 0 }, error: "Failed to fetch repositories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { github_url, title, description, language, framework_id, category_id, license, website_url, docs_url, demo_url, featured_image } = body;

    if (!github_url || !title) {
      return NextResponse.json({ success: false, data: null, error: "github_url and title are required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("repositories")
      .insert({
        github_url,
        title,
        description,
        language,
        framework_id,
        category_id,
        license,
        website_url,
        docs_url,
        demo_url,
        featured_image,
        profile_id: user.id,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data, error: null }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Failed to create repository" }, { status: 500 });
  }
}
