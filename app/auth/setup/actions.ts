"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { TablesUpdate } from "@/types/database.types";

const profileSetupSchema = z.object({
  display_name: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).min(1).max(20),
  experience_years: z.number().min(0).max(50),
  country: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  twitter_url: z.string().url().optional().or(z.literal("")),
  discord_username: z.string().max(100).optional(),
});

export async function saveProfileSetup(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const raw = {
    display_name: formData.get("display_name") as string,
    bio: formData.get("bio") as string,
    skills: JSON.parse(formData.get("skills") as string ?? "[]"),
    experience_years: Number(formData.get("experience_years")),
    country: formData.get("country") as string || undefined,
    website: formData.get("website") as string || undefined,
    linkedin_url: formData.get("linkedin_url") as string || undefined,
    twitter_url: formData.get("twitter_url") as string || undefined,
    discord_username: formData.get("discord_username") as string || undefined,
  };

  const parsed = profileSetupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation error" };
  }

  const updateData: TablesUpdate<"profiles"> = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) return { error: error.message };

  // Grant profile_complete achievement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc("grant_achievement", {
    p_profile_id: user.id,
    p_achievement_code: "profile_complete",
  });

  redirect("/dashboard");
}
