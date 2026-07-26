import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RepositoryGrid from "@/features/repositories/components/RepositoryGrid";

export const dynamic = "force-dynamic";

async function getReposByLanguage(language: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repositories")
    .select("id, title, description, language, github_stars, github_forks, view_count, trending_score, created_at, profile_id, profiles(username, display_name, avatar_url)", { count: "exact" })
    .eq("language", language)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("trending_score", { ascending: false })
    .limit(20);

  return data ?? [];
}

export default async function LanguagePage({ params }: { params: { slug: string } }) {
  const language = decodeURIComponent(params.slug);
  const repos = await getReposByLanguage(language);

  if (!repos.length) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">{language}</h1>
        <p className="text-muted-foreground text-sm">Explore repositories built with {language}.</p>
      </div>
      <RepositoryGrid repos={repos} emptyMessage={`No ${language} repositories found`} />
    </div>
  );
}
