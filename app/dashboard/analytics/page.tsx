import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AnalyticsLineChart } from "@/features/analytics/components/AnalyticsCharts";

export const dynamic = "force-dynamic";

async function getProfileAnalytics() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const [profileResult, reposResult, eventsResult] = await Promise.all([
    supabase.from("profiles").select("xp, level, trust_score, created_at").eq("id", user.id).single(),
    supabase.from("repositories").select("id, title, view_count, github_stars").eq("profile_id", user.id).eq("status", "active").is("deleted_at", null),
    supabase.from("analytics_events").select("event_type, created_at").eq("profile_id", user.id).gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const profile = profileResult.data;
  const repos = reposResult.data ?? [];
  const events = eventsResult.data ?? [];

  const totalViews = repos.reduce((sum, repo) => sum + (repo.view_count || 0), 0);
  const totalStars = repos.reduce((sum, repo) => sum + (repo.github_stars || 0), 0);

  const eventByDay: Record<string, number> = {};
  events.forEach((event) => {
    const day = new Date(event.created_at).toISOString().split("T")[0];
    eventByDay[day] = (eventByDay[day] || 0) + 1;
  });

  const chartData = Object.entries(eventByDay)
    .map(([date, count]) => ({ date, views: count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const eventByType: Record<string, number> = {};
  events.forEach((event) => {
    eventByType[event.event_type] = (eventByType[event.event_type] || 0) + 1;
  });

  return { profile, repos, totalViews, totalStars, chartData, eventByType };
}

export default async function AnalyticsPage() {
  const { profile, repos, totalViews, totalStars, chartData, eventByType } = await getProfileAnalytics();

  if (!profile) redirect("/auth/setup");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground text-sm">Track your profile and repository performance over the last 30 days.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Profile Views", value: totalViews.toLocaleString(), color: "hsl(217 91% 60%)" },
          { label: "Total Stars", value: totalStars.toLocaleString(), color: "hsl(38 92% 50%)" },
          { label: "Repositories", value: repos.length.toString(), color: "hsl(142 71% 45%)" },
          { label: "Trust Score", value: profile.trust_score.toString(), color: "hsl(263 70% 65%)" },
        ].map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-6 mb-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h2 className="text-lg font-semibold mb-4">Activity Over Time</h2>
        {chartData.length > 0 ? (
          <AnalyticsLineChart data={chartData} dataKey="views" xAxisKey="date" color="hsl(217 91% 60%)" height={300} />
        ) : (
          <p className="text-center text-muted-foreground text-sm py-16">No analytics data yet. Start sharing your repositories!</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h2 className="text-lg font-semibold mb-4">Event Types</h2>
          {Object.keys(eventByType).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(eventByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">{type.replace(/_/g, " ")}</span>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-8">No events recorded yet</p>
          )}
        </div>

        <div className="rounded-2xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h2 className="text-lg font-semibold mb-4">Top Repositories</h2>
          {repos.length > 0 ? (
            <div className="space-y-3">
              {repos
                .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                .slice(0, 5)
                .map((repo) => (
                  <div key={repo.id} className="flex items-center justify-between">
                    <span className="text-sm truncate">{repo.title}</span>
                    <span className="text-sm text-muted-foreground">{repo.view_count || 0} views</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-8">No repositories yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
