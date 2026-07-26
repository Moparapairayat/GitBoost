"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface RepositoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (value: string) => void;
  languages?: string[];
}

export default function RepositoryFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  language,
  onLanguageChange,
  languages = [],
}: RepositoryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search repositories..."
          className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none transition-all"
          style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
        />
      </div>

      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-11 px-4 rounded-xl text-sm outline-none transition-all"
          style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
        >
          <option value="latest">Latest</option>
          <option value="trending">Trending</option>
          <option value="popular">Most Viewed</option>
        </select>

        {onLanguageChange && languages.length > 0 && (
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="h-11 px-4 rounded-xl text-sm outline-none transition-all"
            style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
          >
            <option value="">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
