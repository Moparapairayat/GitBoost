"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, GitBranch, Zap } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[120px] opacity-[0.08]"
          style={{ background: "var(--gradient-brand)" }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.05]"
          style={{ background: "hsl(217 91% 60%)" }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-[0.06]"
          style={{ background: "hsl(300 60% 65%)" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
            style={{
              background: "hsl(var(--primary) / 0.08)",
              border: "1px solid hsl(var(--primary) / 0.2)",
              color: "hsl(var(--primary))",
            }}>
            <Zap className="w-3 h-3" />
            <span>The developer discovery platform</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
        >
          Discover Great Projects.
          <br />
          <span className="text-gradient">Grow Organically.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {APP_NAME} connects open-source developers through genuine peer reviews,
          authentic community engagement, and organic project discovery.
          No fake stars. No bots. Just real growth.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              id="hero-dashboard-btn"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "var(--gradient-brand)", color: "white" }}
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/signin"
                id="hero-signin-btn"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] glow-brand"
                style={{ background: "var(--gradient-brand)", color: "white" }}
              >
                <GitBranch className="w-4 h-4" />
                Get Started Free
              </Link>
              <Link
                href="/explore/trending"
                id="hero-explore-btn"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                Explore Projects <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xs text-muted-foreground"
        >
          Free forever · No credit card required · GitHub OAuth
        </motion.p>

        {/* Floating cards preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 relative max-w-3xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}>
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: "hsl(0 84% 60%)" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "hsl(38 92% 50%)" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "hsl(142 71% 45%)" }} />
              <div className="flex-1 mx-4 h-6 rounded-md flex items-center px-3 text-xs text-muted-foreground"
                style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
                gitboost.dev/explore/trending
              </div>
            </div>
            {/* Mock repository cards */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "turborepo-starter", lang: "TypeScript", stars: "2.4k", color: "#3178c6", desc: "Lightning-fast monorepo starter with Next.js 15, Turborepo, and shadcn/ui" },
                { name: "rust-web-api", lang: "Rust", stars: "1.8k", color: "#dea584", desc: "Blazingly fast REST API framework built with Axum and PostgreSQL" },
              ].map((repo) => (
                <div key={repo.name} className="p-4 rounded-xl text-left transition-all hover:scale-[1.01]"
                  style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{repo.name}</span>
                    <span className="text-xs text-muted-foreground">⭐ {repo.stars}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{repo.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
                    style={{ background: `${repo.color}20`, color: repo.color, border: `1px solid ${repo.color}40` }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: repo.color }} />
                    {repo.lang}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
