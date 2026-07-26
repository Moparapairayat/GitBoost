"use client";

import { Star, ThumbsUp } from "lucide-react";
import type { Tables } from "@/types/database.types";
import { formatRelativeTime } from "@/utils/format";

type Review = Tables<"reviews"> & {
  profiles: { username: string; display_name: string | null; avatar_url: string | null } | null;
};

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onHelpful?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ReviewCard({ review, currentUserId, onHelpful, onEdit, onDelete }: ReviewCardProps) {
  const ratings = [
    { label: "Code", value: review.rating_code },
    { label: "Docs", value: review.rating_docs },
    { label: "Perf", value: review.rating_perf },
    { label: "UI", value: review.rating_ui },
    { label: "Arch", value: review.rating_arch },
  ].filter((r) => r.value != null);

  const isOwner = currentUserId === review.profile_id;

  return (
    <div className="rounded-2xl p-6 transition-all hover:shadow-md" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "var(--gradient-brand)", color: "white" }}>
            {(review.profiles?.display_name ?? review.profiles?.username ?? "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{review.profiles?.display_name ?? review.profiles?.username ?? "Unknown"}</p>
            <p className="text-xs text-muted-foreground">@{review.profiles?.username ?? "unknown"} · {formatRelativeTime(review.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: "hsl(38 92% 50% / 0.1)", border: "1px solid hsl(38 92% 50% / 0.2)" }}>
          <Star className="w-4 h-4" style={{ color: "hsl(38 92% 50%)" }} />
          <span className="text-sm font-bold">{review.rating_overall.toFixed(1)}</span>
        </div>
      </div>

      {ratings.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {ratings.map((r) => (
            <span key={r.label} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
              {r.label}: {r.value}/5
            </span>
          ))}
        </div>
      )}

      {review.pros && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-green-500 mb-1">Pros</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{review.pros}</p>
        </div>
      )}

      {review.cons && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-red-400 mb-1">Cons</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{review.cons}</p>
        </div>
      )}

      {review.suggestions && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-blue-400 mb-1">Suggestions</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{review.suggestions}</p>
        </div>
      )}

      {review.body && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{review.body}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid hsl(var(--border))" }}>
        <button onClick={() => onHelpful?.(review.id)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful ({review.helpful_count})
        </button>
        {isOwner && (
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit?.(review.id)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Edit</button>
            <button onClick={() => onDelete?.(review.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
