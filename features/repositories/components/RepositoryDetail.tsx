"use client";

import { motion } from "framer-motion";
import { Star, GitBranch, ExternalLink, Calendar, Eye } from "lucide-react";
import type { Tables } from "@/types/database.types";
import { formatNumber, formatRelativeTime } from "@/utils/format";

type Repository = Tables<"repositories"> & {
  profiles: { username: string; display_name: string | null; avatar_url: string | null } | null;
};

interface RepositoryDetailProps {
  repo: Repository;
}

export default function RepositoryDetail({ repo }: RepositoryDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 mb-6"
        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <GitBranch className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-2xl font-bold">{repo.title}</h1>
          </div>
          <a
            href={repo.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors hover:bg-muted"
            style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
          >
            View on GitHub <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {repo.description && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">{repo.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 mb-6">
          {repo.language && (
            <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
              {repo.language}
            </span>
          )}
          {repo.github_stars > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Star className="w-4 h-4" style={{ color: "hsl(38 92% 50%)" }} />
              {formatNumber(repo.github_stars)} stars
            </div>
          )}
          {repo.github_forks > 0 && (
            <span className="text-xs text-muted-foreground">{formatNumber(repo.github_forks)} forks</span>
          )}
          {repo.view_count > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="w-4 h-4" />
              {formatNumber(repo.view_count)} views
            </div>
          )}
          {repo.created_at && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatRelativeTime(repo.created_at)}
            </div>
          )}
        </div>

        {repo.profiles && (
          <div className="flex items-center gap-3 pt-6" style={{ borderTop: "1px solid hsl(var(--border))" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "var(--gradient-brand)", color: "white" }}>
              {(repo.profiles.display_name ?? repo.profiles.username).charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{repo.profiles.display_name ?? repo.profiles.username}</p>
              <p className="text-xs text-muted-foreground">@{repo.profiles.username}</p>
            </div>
          </div>
        )}
      </motion.div>

      <div className="rounded-2xl p-8" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h2 className="text-lg font-semibold mb-4">About this repository</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This is a placeholder for the repository README and detailed information.
          In the full implementation, this section will display the fetched README content,
          screenshots, tags, and other metadata.
        </p>
      </div>
    </div>
  );
}
