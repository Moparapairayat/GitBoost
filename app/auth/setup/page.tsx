import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileSetupClient from "./ProfileSetupClient";
import type { Tables } from "@/types/database.types";

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

  const profileData = profile as Tables<"profiles">;

  // If already fully set up, go to dashboard
  const isComplete = profileData.bio && profileData.skills && profileData.skills.length > 0 && profileData.experience_years !== null;
  if (isComplete) redirect("/dashboard");

  return <ProfileSetupClient profile={profileData} />;
}
