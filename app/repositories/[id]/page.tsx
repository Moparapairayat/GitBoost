import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RepositoryDetail from "@/features/repositories/components/RepositoryDetail";

export const dynamic = "force-dynamic";

async function getRepository(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("repositories")
    .select("*, profiles(username, display_name, avatar_url, github_username)")
    .eq("id", id)
    .eq("status", "active")
    .is("deleted_at", null)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function RepositoryDetailPage({ params }: { params: { id: string } }) {
  const repo = await getRepository(params.id);
  if (!repo) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <RepositoryDetail repo={repo} />
    </div>
  );
}
