import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AnalyticsLineChart } from "@/features/analytics/components/AnalyticsCharts";

export const dynamic = "force-dynamic";

async function getRepositoryAnalytics(repoId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: repo } = await supabase
    .from("repositories")
    .select("id, title, view_count, github_stars, github_forks")
    .eq("id", repoId)
    .eq("profile_id", user.id)
    .single();

  if (!repo) return null;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_type, created_at")
    .eq("repository_id", repoId)
    .gte("created_at", thirtyDaysAgo);

  const eventsData = events ?? [];

  const eventByDay: Record<string, number> = {};
  eventsData.forEach((event) => {
    const day = new Date(event.created_at).toISOString().split("T")[0];
    eventByDay[day] = (eventByDay[day] || 0) + 1;
  });

  const chartData = Object.entries(eventByDay)
    .map(([date, count]) => ({ date, views: count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const eventByType: Record<string, number> = {};
  eventsData.forEach((event) => {
    eventByType[event.event_type] = (eventByType[event.event_type] || 0) + 1;
  });

  return { repo, chartData, eventByType };
}

export default async function RepositoryAnalyticsPage({ params }: { params: { id: string } }) {
  const data = await getRepositoryAnalytics(params.id);
  if (!data) notFound();

  const { repo, chartData, eventByType } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{repo.title} — Analytics</h1>
        <p className="text-muted-foreground text-sm">Performance metrics for the last 30 days.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Views", value: repo.view_count.toLocaleString(), color: "hsl(217 91% 60%)" },
          { label: "GitHub Stars", value: repo.github_stars.toLocaleString(), color: "hsl(38 92% 50%)" },
          { label: "Forks", value: repo.github_forks.toLocaleString(), color: "hsl(142 71% 45%)" },
          { label: "Events (30d)", value: chartData.reduce((sum, d) => sum + d.views, 0).toLocaleString(), color: "hsl(263 70% 65%)" },
        ].map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-6 mb-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h2 className="text-lg font-semibold mb-4">Views Over Time</h2>
        {chartData.length > 0 ? (
          <AnalyticsLineChart data={chartData} dataKey="views" xAxisKey="date" color="hsl(217 91% 60%)" height={300} />
        ) : (
          <p className="text-center text-muted-foreground text-sm py-16">No analytics data yet. Share your repository to start collecting data!</p>
        )}
      </div>

      <div className="rounded-2xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h2 className="text-lg font-semibold mb-4">Event Breakdown</h2>
        {Object.keys(eventByType).length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(eventByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
                <span className="text-sm capitalize">{type.replace(/_/g, " ")}</span>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm py-8">No events recorded yet</p>
        )}
      </div>
    </div>
  );
}
