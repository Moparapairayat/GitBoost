"use client";

import { useState } from "react";
import { Star, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface StarInputProps {
  value: number;
  onChange: (v: number) => void;
  color: string;
}

function StarInput({ value, onChange, color }: StarInputProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} className="transition-all">
          <Star className={`w-5 h-5 ${star <= value ? "fill-current" : "fill-none"}`} style={{ color: star <= value ? color : "hsl(var(--muted-foreground))" }} />
        </button>
      ))}
    </div>
  );
}

interface ReviewFormProps {
  repositoryId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ repositoryId, onSuccess }: ReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    rating_overall: 0,
    rating_code: 0,
    rating_docs: 0,
    rating_perf: 0,
    rating_ui: 0,
    rating_arch: 0,
    pros: "",
    cons: "",
    suggestions: "",
    body: "",
  });

  const ratings = [
    { key: "rating_code", label: "Code Quality" },
    { key: "rating_docs", label: "Documentation" },
    { key: "rating_perf", label: "Performance" },
    { key: "rating_ui", label: "UI/UX" },
    { key: "rating_arch", label: "Architecture" },
  ] as const;

  async function handleSubmit() {
    if (form.rating_overall === 0) {
      toast.error("Please provide an overall rating");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repositoryId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Review submitted successfully!");
        setForm({ rating_overall: 0, rating_code: 0, rating_docs: 0, rating_perf: 0, rating_ui: 0, rating_arch: 0, pros: "", cons: "", suggestions: "", body: "" });
        onSuccess?.();
      } else {
        toast.error(json.error || "Failed to submit review");
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl p-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Overall Rating *</label>
          <StarInput value={form.rating_overall} onChange={(v) => setForm((f) => ({ ...f, rating_overall: v }))} color="hsl(38 92% 50%)" />
        </div>

        {ratings.map((r) => (
          <div key={r.key}>
            <label className="block text-sm font-medium mb-2">{r.label}</label>
            <StarInput value={form[r.key]} onChange={(v) => setForm((f) => ({ ...f, [r.key]: v }))} color="hsl(217 91% 60%)" />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-2">Pros</label>
          <textarea value={form.pros} onChange={(e) => setForm((f) => ({ ...f, pros: e.target.value }))} placeholder="What did you like?" rows={2} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cons</label>
          <textarea value={form.cons} onChange={(e) => setForm((f) => ({ ...f, cons: e.target.value }))} placeholder="What could be improved?" rows={2} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Suggestions</label>
          <textarea value={form.suggestions} onChange={(e) => setForm((f) => ({ ...f, suggestions: e.target.value }))} placeholder="Any suggestions for the author?" rows={2} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Review Body</label>
          <textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} placeholder="Write your detailed review..." rows={4} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold transition-all disabled:opacity-60" style={{ background: "var(--gradient-brand)", color: "white" }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
