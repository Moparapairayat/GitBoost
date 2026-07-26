"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

interface SubmitRepositoryFormProps {
  onSuccess?: () => void;
}

export default function SubmitRepositoryForm({ onSuccess }: SubmitRepositoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    github_url: "",
    title: "",
    description: "",
    language: "",
    category_id: "",
    license: "",
    website_url: "",
    docs_url: "",
    demo_url: "",
  });

  async function handleFetchMetadata() {
    if (!form.github_url) {
      toast.error("Please enter a GitHub URL");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/github/fetch-metadata?url=${encodeURIComponent(form.github_url)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setForm((f) => ({
          ...f,
          title: json.data.title || f.title,
          description: json.data.description || f.description,
          language: json.data.language || f.language,
        }));
        toast.success("Repository metadata fetched");
      } else {
        toast.error(json.error || "Failed to fetch metadata");
      }
    } catch {
      toast.error("Failed to fetch metadata");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!form.github_url || !form.title) {
      toast.error("GitHub URL and title are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/repositories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Repository submitted for review!");
        onSuccess?.();
      } else {
        toast.error(json.error || "Failed to submit repository");
      }
    } catch {
      toast.error("Failed to submit repository");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl p-8" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Submit Repository</h1>
          <p className="text-sm text-muted-foreground">Share your open-source project with the GitBoost community.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub Repository URL *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.github_url}
                onChange={(e) => setForm((f) => ({ ...f, github_url: e.target.value }))}
                placeholder="https://github.com/owner/repo"
                className="flex-1 h-11 px-4 rounded-xl text-sm outline-none"
                style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              />
              <button
                onClick={handleFetchMetadata}
                disabled={loading}
                className="px-4 h-11 rounded-xl text-sm font-medium transition-all disabled:opacity-60"
                style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="My Awesome Project"
              className="w-full h-11 px-4 rounded-xl text-sm outline-none"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of your project..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <input
                type="text"
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                placeholder="TypeScript"
                className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">License</label>
              <input
                type="text"
                value={form.license}
                onChange={(e) => setForm((f) => ({ ...f, license: e.target.value }))}
                placeholder="MIT"
                className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website URL</label>
            <input
              type="text"
              value={form.website_url}
              onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
              placeholder="https://yourproject.com"
              className="w-full h-11 px-4 rounded-xl text-sm outline-none"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Documentation URL</label>
            <input
              type="text"
              value={form.docs_url}
              onChange={(e) => setForm((f) => ({ ...f, docs_url: e.target.value }))}
              placeholder="https://docs.yourproject.com"
              className="w-full h-11 px-4 rounded-xl text-sm outline-none"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Demo URL</label>
            <input
              type="text"
              value={form.demo_url}
              onChange={(e) => setForm((f) => ({ ...f, demo_url: e.target.value }))}
              placeholder="https://demo.yourproject.com"
              className="w-full h-11 px-4 rounded-xl text-sm outline-none"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{ background: "var(--gradient-brand)", color: "white" }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {loading ? "Submitting..." : "Submit Repository"}
          </button>
        </div>
      </div>
    </div>
  );
}
