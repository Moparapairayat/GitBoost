import { createClient } from "@/lib/supabase/server";
import RepositoryGrid from "@/features/repositories/components/RepositoryGrid";
import RepositoryFilters from "@/features/repositories/components/RepositoryFilters";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function getTrendingRepos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repositories")
    .select("id, title, description, language, github_stars, github_forks, view_count, trending_score, created_at, profile_id, profiles(username, display_name, avatar_url)", { count: "exact" })
    .eq("status", "active")
    .is("deleted_at", null)
    .order("trending_score", { ascending: false })
    .limit(20);

  return data ?? [];
}

export default async function TrendingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const repos = await getTrendingRepos();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Trending Projects</h1>
        <p className="text-muted-foreground text-sm">Discover repositories gaining genuine traction through community engagement.</p>
      </div>
      <Suspense fallback={<div className="text-center py-16 text-muted-foreground text-sm">Loading...</div>}>
        <RepositoryFilters
          search={params.q ?? ""}
          onSearchChange={() => {}}
          sort="trending"
          onSortChange={() => {}}
        />
        <RepositoryGrid repos={repos} />
      </Suspense>
    </div>
  );
}
