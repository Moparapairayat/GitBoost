"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

const featuredDevelopers = [
  {
    id: "1",
    name: "Sarah Chen",
    username: "sarahchen",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    bio: "Open-source maintainer. Building developer tools.",
    skills: ["TypeScript", "React", "Node.js"],
    reputation: "12.4k",
    repos: 8,
  },
  {
    id: "2",
    name: "Alex Rivera",
    username: "arivera",
    avatar: "https://avatars.githubusercontent.com/u/2?v=4",
    bio: "Full-stack engineer. Rust enthusiast.",
    skills: ["Rust", "Go", "PostgreSQL"],
    reputation: "9.8k",
    repos: 5,
  },
  {
    id: "3",
    name: "Mika Tanaka",
    username: "mikat",
    avatar: "https://avatars.githubusercontent.com/u/3?v=4",
    bio: "DevRel & community builder.",
    skills: ["Python", "ML", "Docker"],
    reputation: "15.2k",
    repos: 12,
  },
];

export default function FeaturedDevelopers() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="developers">
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
              Featured Developers
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Meet top contributors
              <br />
              <span className="text-gradient">in the community</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Developers who consistently submit quality projects, write helpful reviews, and contribute to the open-source ecosystem.
            </p>
          </motion.div>
        </div>

        {/* Developers grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDevelopers.map((dev, i) => (
            <motion.div
              key={dev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            >
              {/* Avatar & basic info */}
              <div className="flex items-center gap-4 mb-4">
              <Image
                src={dev.avatar}
                alt={dev.name}
                width={56}
                height={56}
                className="rounded-full"
                style={{ border: "2px solid hsl(var(--border))" }}
              />
                <div>
                  <h3 className="text-sm font-semibold">{dev.name}</h3>
                  <p className="text-xs text-muted-foreground">@{dev.username}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{dev.bio}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {dev.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3.5 h-3.5" style={{ color: "hsl(38 92% 50%)" }} />
                  {dev.reputation} reputation
                </div>
                <span className="text-xs text-muted-foreground">{dev.repos} repos</span>
              </div>
            </motion.div>
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
            href="/explore/latest"
            id="developers-cta"
            className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
          >
            Discover more developers <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
