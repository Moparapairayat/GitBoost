import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileSetupClient from "./ProfileSetupClient";

export default async function ProfileSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/signin");

  // If already fully set up, go to dashboard
  const isComplete = profile.bio && profile.skills && profile.skills.length > 0 && profile.experience_years !== null;
  if (isComplete) redirect("/dashboard");

  return <ProfileSetupClient profile={profile} />;
}
