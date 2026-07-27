import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Star, Code2, Bell, TrendingUp, Award } from "lucide-react";
import { getLevelName, getXPProgress } from "@/utils/xp";
import { formatNumber } from "@/utils/format";
import type { Tables } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Dashboard — GitBoost",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profileData = profile as Tables<"profiles"> | null;
  if (!profileData) redirect("/auth/setup");

  const { data: repoCount } = await supabase
    .from("repositories")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", user.id)
    .is("deleted_at", null);

  const { data: reviewCount } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", user.id)
    .is("deleted_at", null);

  const { data: unreadNotifs } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", user.id)
    .eq("is_read", false);

  const { data: achievements } = await supabase
    .from("profile_achievements")
    .select("achievement_id, achievements(name, icon, rarity)")
    .eq("profile_id", user.id)
    .limit(4);

  const xpProgress = getXPProgress(profileData.xp, profileData.level);
  const levelName = getLevelName(profileData.level);

  type CountResult = { count: number | null } | null;
  type AchievementResult = { achievement_id: string; achievements: { name: string; icon: string | null; rarity: string } | null };

  const stats = [
    { label: "Repositories", value: (repoCount as CountResult)?.count ?? 0, icon: Code2, color: "hsl(217 91% 60%)" },
    { label: "Reviews Written", value: (reviewCount as CountResult)?.count ?? 0, icon: Star, color: "hsl(38 92% 50%)" },
    { label: "Notifications", value: (unreadNotifs as CountResult)?.count ?? 0, icon: Bell, color: "hsl(263 70% 65%)" },
    { label: "Trust Score", value: profileData.trust_score, icon: TrendingUp, color: "hsl(142 71% 45%)" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {profileData.display_name ?? profileData.username} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Here&apos;s what&apos;s happening with your GitBoost profile.
        </p>
      </div>

      {/* XP + Level Card */}
      <div className="rounded-2xl p-6 mb-6 border-gradient"
        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Level {profileData.level}</p>
            <p className="text-lg font-bold">{levelName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Total XP</p>
            <p className="text-xl font-bold text-gradient">{formatNumber(profileData.xp)}</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${xpProgress.percentage}%`, background: "var(--gradient-brand)" }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{formatNumber(xpProgress.current)} XP</span>
          <span>{xpProgress.percentage}% to Level {profileData.level + 1}</span>
          <span>{formatNumber(xpProgress.required)} XP needed</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-5 transition-all hover:scale-[1.02]"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-bold">{formatNumber(stat.value)}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
            <h2 className="font-semibold text-sm">Recent Achievements</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((a: AchievementResult) => (
              <div key={a.achievement_id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "hsl(var(--muted))" }}>
                <span className="text-2xl">{a.achievements?.icon ?? "🏆"}</span>
                <span className="text-xs font-medium">{a.achievements?.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Link href="/repositories/submit"
          className="flex items-center gap-4 p-5 rounded-xl transition-all hover:scale-[1.02] group"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          id="submit-repo-cta">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(var(--primary) / 0.15)" }}>
            <Code2 className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
          </div>
          <div>
            <p className="font-semibold text-sm">Submit a Repository</p>
            <p className="text-xs text-muted-foreground">Share your project with the community</p>
          </div>
        </Link>

        <Link href="/explore/trending"
          className="flex items-center gap-4 p-5 rounded-xl transition-all hover:scale-[1.02] group"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          id="explore-cta">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(38 92% 50% / 0.15)" }}>
            <TrendingUp className="w-5 h-5" style={{ color: "hsl(38 92% 50%)" }} />
          </div>
          <div>
            <p className="font-semibold text-sm">Explore Trending</p>
            <p className="text-xs text-muted-foreground">Discover what the community loves</p>
          </div>
        </Link>

        <Link href="/dashboard/achievements"
          className="flex items-center gap-4 p-5 rounded-xl transition-all hover:scale-[1.02] group"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          id="achievements-cta">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(263 70% 65% / 0.15)" }}>
            <Award className="w-5 h-5" style={{ color: "hsl(263 70% 65%)" }} />
          </div>
          <div>
            <p className="font-semibold text-sm">Achievements</p>
            <p className="text-xs text-muted-foreground">View your badges and milestones</p>
          </div>
        </Link>

        <Link href="/dashboard/notifications"
          className="flex items-center gap-4 p-5 rounded-xl transition-all hover:scale-[1.02] group"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          id="notifications-cta">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(217 91% 60% / 0.15)" }}>
            <Bell className="w-5 h-5" style={{ color: "hsl(217 91% 60%)" }} />
          </div>
          <div>
            <p className="font-semibold text-sm">Notifications</p>
            <p className="text-xs text-muted-foreground">Check your latest updates</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
