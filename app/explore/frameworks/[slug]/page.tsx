import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RepositoryGrid from "@/features/repositories/components/RepositoryGrid";

export const dynamic = "force-dynamic";

async function getFramework(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("frameworks")
    .select("id, name, slug, languages(name)")
    .eq("slug", slug)
    .single();

  return data as { id: string; name: string; slug: string; languages: { name: string } | null } | null;
}

async function getReposByFramework(frameworkId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repositories")
    .select("id, title, description, language, github_stars, github_forks, view_count, trending_score, created_at, profile_id, profiles!repositories_profile_id_fkey(username, display_name, avatar_url)", { count: "exact" })
    .eq("framework_id", frameworkId)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("trending_score", { ascending: false })
    .limit(20);

  return data ?? [];
}

export default async function FrameworkPage({ params }: { params: { slug: string } }) {
  const framework = await getFramework(params.slug);
  if (!framework) notFound();

  const repos = await getReposByFramework(framework.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">{framework.name}</h1>
        <p className="text-muted-foreground text-sm">
          Explore repositories built with {framework.name}{framework.languages ? ` (${framework.languages.name})` : ""}.
        </p>
      </div>
      <RepositoryGrid repos={repos} emptyMessage={`No ${framework.name} repositories found`} />
    </div>
  );
}
