import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SubmitRepositoryForm from "@/features/repositories/components/SubmitRepositoryForm";

export const dynamic = "force-dynamic";

export default async function SubmitRepositoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_banned")
    .eq("id", user.id)
    .single();

  const profileData = profile as { role: string; is_banned: boolean } | null;
  if (profileData?.is_banned) redirect("/auth/signin?error=banned");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Submit Repository</h1>
        <p className="text-muted-foreground text-sm">Share your open-source project with the GitBoost community.</p>
      </div>
      <SubmitRepositoryForm onSuccess={() => redirect("/dashboard")} />
    </div>
  );
}
