"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ReviewCard from "./ReviewCard";
import type { Tables } from "@/types/database.types";

type Review = Tables<"reviews"> & {
  profiles: { username: string; display_name: string | null; avatar_url: string | null } | null;
};

interface ReviewListProps {
  repositoryId: string;
  currentUserId?: string;
}

export default function ReviewList({ repositoryId, currentUserId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/repositories/${repositoryId}/reviews`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setReviews(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repositoryId]);

  function handleHelpful(id: string) {
    fetch(`/api/v1/reviews/${id}/vote`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vote: true }) })
      .then(() => setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, helpful_count: r.helpful_count + 1 } : r))))
      .catch(() => {});
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this review?")) return;
    fetch(`/api/v1/reviews/${id}`, { method: "DELETE" })
      .then(() => setReviews((prev) => prev.filter((r) => r.id !== id)))
      .catch(() => toast.error("Failed to delete review"));
  }

  if (loading) {
    return <div className="text-center py-16 text-muted-foreground text-sm">Loading reviews...</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, i) => (
        <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
          <ReviewCard review={review} currentUserId={currentUserId} onHelpful={handleHelpful} onDelete={handleDelete} />
        </motion.div>
      ))}
      {!reviews.length && <p className="text-center text-muted-foreground text-sm py-8">No reviews yet. Be the first to review!</p>}
    </div>
  );
}
