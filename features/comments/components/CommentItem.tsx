"use client";

import { useState } from "react";
import { MessageCircle, Loader2, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  body: string;
  is_edited: boolean;
  created_at: string;
  profile_id: string;
  parent_id: string | null;
  profiles: { username: string; display_name: string | null; avatar_url: string | null } | null;
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  repositoryId: string;
  onDelete?: (id: string) => void;
  depth?: number;
}

export default function CommentItem({ comment, currentUserId, repositoryId, onDelete, depth = 0 }: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleReply() {
    if (!replyBody.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repositoryId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody, parent_id: comment.id }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Reply added");
        setReplyBody("");
        setReplyOpen(false);
      } else {
        toast.error(json.error || "Failed to add reply");
      }
    } catch {
      toast.error("Failed to add reply");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`/api/v1/comments/${comment.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Comment deleted");
        onDelete?.(comment.id);
      } else {
        toast.error(json.error || "Failed to delete comment");
      }
    } catch {
      toast.error("Failed to delete comment");
    }
  }

  const isOwner = currentUserId === comment.profile_id;

  return (
    <div className={`${depth > 0 ? "ml-12 border-l-2 pl-4" : ""}`} style={{ borderColor: "hsl(var(--border))" }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: "var(--gradient-brand)", color: "white" }}>
          {(comment.profiles?.display_name ?? comment.profiles?.username ?? "U").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{comment.profiles?.display_name ?? comment.profiles?.username ?? "Unknown"}</span>
            <span className="text-xs text-muted-foreground">@{comment.profiles?.username ?? "unknown"}</span>
            <span className="text-xs text-muted-foreground">· {new Date(comment.created_at).toLocaleDateString()}</span>
            {comment.is_edited && <span className="text-xs text-muted-foreground">(edited)</span>}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{comment.body}</p>
          <div className="flex items-center gap-3 mt-2">
            {depth === 0 && (
              <button onClick={() => setReplyOpen(!replyOpen)} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> Reply
              </button>
            )}
            {isOwner && (
              <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
          </div>
          {replyOpen && (
            <div className="mt-3 flex gap-2">
              <input
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 h-10 px-4 rounded-xl text-sm outline-none"
                style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              />
              <button onClick={handleReply} disabled={submitting} className="px-4 h-10 rounded-xl text-sm font-medium transition-all disabled:opacity-60" style={{ background: "var(--gradient-brand)", color: "white" }}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
