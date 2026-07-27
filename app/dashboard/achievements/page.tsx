import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AchievementCard from "@/features/gamification/components/AchievementCard";
import XPProgress from "@/features/gamification/components/XPProgress";

export const dynamic = "force-dynamic";

async function getAchievements() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const [profileResult, allAchievementsResult, userAchievementsResult] = await Promise.all([
    supabase.from("profiles").select("xp, level").eq("id", user.id).single(),
    supabase.from("achievements").select("*").eq("is_active", true).order("rarity").order("xp_reward", { ascending: false }),
    supabase.from("profile_achievements").select("achievement_id, earned_at").eq("profile_id", user.id),
  ]);

  const profile = profileResult.data;
  const allAchievements = allAchievementsResult.data ?? [];
  const userAchievements = userAchievementsResult.data ?? [];

  const earnedIds = new Set(userAchievements.map((ua) => ua.achievement_id));
  const earnedMap = new Map(userAchievements.map((ua) => [ua.achievement_id, ua.earned_at]));

  return { profile, allAchievements, earnedIds, earnedMap };
}

export default async function AchievementsPage() {
  const { profile, allAchievements, earnedIds, earnedMap } = await getAchievements();

  if (!profile) redirect("/auth/setup");

  const earnedCount = earnedIds.size;
  const totalCount = allAchievements.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Achievements</h1>
        <p className="text-muted-foreground text-sm">
          {earnedCount} / {totalCount} unlocked
        </p>
      </div>

      <div className="mb-8 p-6 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <XPProgress xp={profile.xp} level={profile.level} size="lg" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {allAchievements.map((achievement, i) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            earned={earnedIds.has(achievement.id)}
            earnedAt={earnedMap.get(achievement.id)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
