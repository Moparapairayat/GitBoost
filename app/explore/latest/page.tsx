import { createClient } from "@/lib/supabase/server";
import RepositoryGrid from "@/features/repositories/components/RepositoryGrid";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function getLatestRepos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repositories")
    .select("id, title, description, language, github_stars, github_forks, view_count, trending_score, created_at, profile_id, profiles(username, display_name, avatar_url)", { count: "exact" })
    .eq("status", "active")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}

export default async function LatestPage() {
  const repos = await getLatestRepos();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Latest Projects</h1>
        <p className="text-muted-foreground text-sm">Recently submitted repositories from the community.</p>
      </div>
      <Suspense fallback={<div className="text-center py-16 text-muted-foreground text-sm">Loading...</div>}>
        <RepositoryGrid repos={repos} emptyMessage="No repositories found" />
      </Suspense>
    </div>
  );
}
