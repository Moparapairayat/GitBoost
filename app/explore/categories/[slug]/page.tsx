import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RepositoryGrid from "@/features/repositories/components/RepositoryGrid";

export const dynamic = "force-dynamic";

async function getCategory(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  return data as { id: string; name: string; slug: string } | null;
}

async function getReposByCategory(categoryId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repositories")
    .select("id, title, description, language, github_stars, github_forks, view_count, trending_score, created_at, profile_id, profiles(username, display_name, avatar_url)", { count: "exact" })
    .eq("category_id", categoryId)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("trending_score", { ascending: false })
    .limit(20);

  return data ?? [];
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug);
  if (!category) notFound();

  const repos = await getReposByCategory(category.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground text-sm">Explore repositories in this category.</p>
      </div>
      <RepositoryGrid repos={repos} emptyMessage={`No repositories found in ${category.name}`} />
    </div>
  );
}
