"use client";

import Link from "next/link";
import { Star, GitBranch, ExternalLink } from "lucide-react";
import type { Tables } from "@/types/database.types";
import { formatNumber } from "@/utils/format";

type Repository = {
  id: string;
  title: string;
  description: string | null;
  language: string | null;
  github_stars: number;
  github_forks: number;
  profiles: { username: string; display_name: string | null; avatar_url: string | null } | null;
};

interface RepositoryCardProps {
  repo: Repository;
}

export default function RepositoryCard({ repo }: RepositoryCardProps) {
  return (
    <Link
      href={`/repositories/${repo.id}`}
      className="group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-lg block"
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <GitBranch className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{repo.title}</span>
        </div>
        {repo.github_stars > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0 ml-2">
            <Star className="w-3.5 h-3.5" style={{ color: "hsl(38 92% 50%)" }} />
            {formatNumber(repo.github_stars)}
          </div>
        )}
      </div>

      {repo.description && (
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{repo.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {repo.language && (
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
              {repo.language}
            </span>
          )}
          {repo.github_forks > 0 && (
            <span className="text-xs text-muted-foreground">{formatNumber(repo.github_forks)} forks</span>
          )}
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}
