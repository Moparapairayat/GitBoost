"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import CommentItem from "./CommentItem";

interface Comment {
  id: string;
  body: string;
  is_edited: boolean;
  created_at: string;
  profile_id: string;
  parent_id: string | null;
  profiles: { username: string; display_name: string | null; avatar_url: string | null } | null;
}

interface CommentSectionProps {
  repositoryId: string;
  currentUserId?: string;
}

export default function CommentSection({ repositoryId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/repositories/${repositoryId}/comments`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setComments(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repositoryId]);

  async function handleSubmit() {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repositoryId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newComment }),
      });
      const json = await res.json();
      if (json.success) {
        setComments((prev) => [...prev, json.data]);
        setNewComment("");
        toast.success("Comment added");
      } else {
        toast.error(json.error || "Failed to add comment");
      }
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDelete(id: string) {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  const topLevel = comments.filter((c) => !c.parent_id);

  return (
    <div className="rounded-2xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Comments ({comments.length})
      </h3>

      <div className="flex gap-2 mb-6">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 h-11 px-4 rounded-xl text-sm outline-none"
          style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
        />
        <button onClick={handleSubmit} disabled={submitting} className="px-4 h-11 rounded-xl text-sm font-medium transition-all disabled:opacity-60" style={{ background: "var(--gradient-brand)", color: "white" }}>
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">Loading comments...</div>
      ) : (
        <div className="space-y-6">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              repositoryId={repositoryId}
              onDelete={handleDelete}
              depth={0}
            />
          ))}
          {!topLevel.length && <p className="text-center text-muted-foreground text-sm py-8">No comments yet. Start the conversation!</p>}
        </div>
      )}
    </div>
  );
}
