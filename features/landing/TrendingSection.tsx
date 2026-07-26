"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, GitBranch } from "lucide-react";

const trendingRepos = [
  {
    id: "1",
    title: "turborepo-starter",
    description: "Lightning-fast monorepo starter with Next.js 15, Turborepo, and shadcn/ui",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: "2.4k",
    forks: "184",
    url: "https://github.com/example/turborepo-starter",
  },
  {
    id: "2",
    title: "rust-web-api",
    description: "Blazingly fast REST API framework built with Axum and PostgreSQL",
    language: "Rust",
    languageColor: "#dea584",
    stars: "1.8k",
    forks: "142",
    url: "https://github.com/example/rust-web-api",
  },
  {
    id: "3",
    title: "react-native-kit",
    description: "Production-ready React Native boilerplate with Expo, NativeWind, and Reanimated",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: "3.1k",
    forks: "267",
    url: "https://github.com/example/react-native-kit",
  },
  {
    id: "4",
    title: "go-microservices",
    description: "Microservices template with Go, gRPC, Kubernetes, and observability built-in",
    language: "Go",
    languageColor: "#00ADD8",
    stars: "1.5k",
    forks: "98",
    url: "https://github.com/example/go-microservices",
  },
];

export default function TrendingSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="trending">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "hsl(var(--primary))" }}>
              Trending Now
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Projects the community
              <br />
              <span className="text-gradient">is excited about</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Discover open-source projects gaining genuine traction through reviews, comments, and developer engagement.
            </p>
          </motion.div>
        </div>

        {/* Repositories grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {trendingRepos.map((repo, i) => (
            <motion.a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors">{repo.title}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3.5 h-3.5" />
                  {repo.stars}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{repo.description}</p>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                  style={{ background: `${repo.languageColor}15`, color: repo.languageColor, border: `1px solid ${repo.languageColor}30` }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: repo.languageColor }} />
                  {repo.language}
                </span>
                <span className="text-xs text-muted-foreground">{repo.forks} forks</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/explore/trending"
            id="trending-cta"
            className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
          >
            Explore all trending <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
