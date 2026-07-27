"use client";

import { motion } from "framer-motion";
import RepositoryCard from "./RepositoryCard";
import type { Tables } from "@/types/database.types";

type Repository = {
  id: string;
  title: string;
  description: string | null;
  language: string | null;
  github_stars: number;
  github_forks: number;
  profiles: { username: string; display_name: string | null; avatar_url: string | null } | null;
};

interface RepositoryGridProps {
  repos: Repository[];
  emptyMessage?: string;
}

export default function RepositoryGrid({ repos, emptyMessage = "No repositories found" }: RepositoryGridProps) {
  if (!repos.length) {
    return (
      <div className="text-center py-16 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {repos.map((repo, i) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <RepositoryCard repo={repo} />
        </motion.div>
      ))}
    </div>
  );
}
