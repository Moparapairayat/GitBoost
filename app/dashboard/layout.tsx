import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, role, xp, level, is_banned")
    .eq("id", user.id)
    .single();

  if (!profile || profile.is_banned) redirect("/auth/signin?error=banned");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  );
}
