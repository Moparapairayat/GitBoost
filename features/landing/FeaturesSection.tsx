"use client";

import { motion } from "framer-motion";
import { Search, Star, Zap, Users, Shield, TrendingUp, Code2, Award } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Intelligent Discovery",
    description: "Find projects by language, framework, category, or trending score. Personalized recommendations based on your skills and interests.",
    color: "hsl(217 91% 60%)",
  },
  {
    icon: Star,
    title: "Genuine Reviews",
    description: "Multi-dimensional code reviews covering quality, documentation, performance, UI, and architecture. One honest review per developer.",
    color: "hsl(38 92% 50%)",
  },
  {
    icon: Zap,
    title: "Gamification System",
    description: "Earn XP, unlock achievements, complete daily missions, and climb the leaderboard. Your growth is recognized and rewarded.",
    color: "hsl(263 70% 65%)",
  },
  {
    icon: Users,
    title: "Developer Community",
    description: "Connect with open-source developers through comments, nested replies, @mentions, and emoji reactions. Real conversations, real connections.",
    color: "hsl(142 71% 45%)",
  },
  {
    icon: Shield,
    title: "No Fake Engagement",
    description: "Every GitHub interaction is manual. No auto-stars, no bots, no follow-for-follow schemes. Authentic growth only.",
    color: "hsl(0 84% 60%)",
  },
  {
    icon: TrendingUp,
    title: "Trending Algorithm",
    description: "Projects rise based on genuine community engagement — views, reviews, helpful votes, and comments — with a recency decay for fairness.",
    color: "hsl(300 60% 65%)",
  },
  {
    icon: Code2,
    title: "Rich Repository Pages",
    description: "Auto-fetched README, screenshots, tech stack badges, demo links, documentation, and a direct GitHub button. Everything reviewers need.",
    color: "hsl(38 92% 50%)",
  },
  {
    icon: Award,
    title: "Developer Analytics",
    description: "Track profile views, repository views, GitHub click-throughs, and growth trends. Know what's working for your projects.",
    color: "hsl(217 91% 60%)",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="features">
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
              Platform Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to grow
              <br />
              <span className="text-gradient">as an open-source developer</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              GitBoost combines discovery, community, and analytics in one premium platform built specifically for developers.
            </p>
          </motion.div>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
