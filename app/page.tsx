import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/features/landing/HeroSection";
import FeaturesSection from "@/features/landing/FeaturesSection";
import TrendingSection from "@/features/landing/TrendingSection";
import FeaturedDevelopers from "@/features/landing/FeaturedDevelopers";
import StatsSection from "@/features/landing/StatsSection";
import PricingSection from "@/features/landing/PricingSection";
import FAQSection from "@/features/landing/FAQSection";
import LandingFooter from "@/components/layout/LandingFooter";
import LandingNav from "@/components/layout/LandingNav";
import { APP_NAME, APP_TAGLINE, APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description:
    "GitBoost is the developer community platform to discover quality open-source projects, receive genuine feedback, and grow organically.",
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description:
      "Discover quality open-source projects, connect with developers, and grow organically.",
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description:
      "Discover quality open-source projects, connect with developers, and grow organically.",
    creator: "@gitboostdev",
    images: [`${APP_URL}/og-image.png`],
  },
};

export default async function HomePage() {
  let user = null;
  let repoCount = 0;
  let userCount = 0;

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      user = u;

      const [{ count: rc }, { count: uc }] = await Promise.all([
        supabase.from("repositories").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).is("deleted_at", null),
      ]);
      repoCount = rc ?? 0;
      userCount = uc ?? 0;
    }
  } catch {
    // Supabase not yet configured — render page without live data
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav isAuthenticated={!!user} />
      <main>
        <HeroSection isAuthenticated={!!user} />
        <FeaturesSection />
        <TrendingSection />
        <FeaturedDevelopers />
        <StatsSection repoCount={repoCount ?? 0} userCount={userCount ?? 0} />
        <PricingSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  );
}
