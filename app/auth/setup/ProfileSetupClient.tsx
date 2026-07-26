"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, ChevronLeft, Check, Plus, X } from "lucide-react";
import { saveProfileSetup } from "./actions";
import { toast } from "sonner";
import type { Tables } from "@/types/database.types";
import { APP_NAME } from "@/lib/constants";

type Profile = Tables<"profiles">;

const SKILLS_SUGGESTIONS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Python", "Rust", "Go",
  "Node.js", "PostgreSQL", "Docker", "Kubernetes", "AWS", "GraphQL", "REST APIs",
  "Machine Learning", "DevOps", "UI/UX", "Mobile", "Vue.js", "Swift", "Kotlin",
];

const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "Canada", "Australia",
  "India", "Brazil", "Netherlands", "Sweden", "Norway", "Japan", "South Korea",
  "Singapore", "Spain", "Italy", "Poland", "Ukraine", "Turkey", "Mexico",
];

const STEPS = [
  { id: 1, title: "Your Identity", description: "Tell us who you are" },
  { id: 2, title: "Your Skills",   description: "What do you specialize in?" },
  { id: 3, title: "Social Links",  description: "Connect your profiles" },
  { id: 4, title: "You're all set!", description: "Ready to explore" },
];

interface ProfileSetupClientProps {
  profile: Profile;
}

export default function ProfileSetupClient({ profile }: ProfileSetupClientProps) {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    display_name: profile.display_name ?? "",
    bio: profile.bio ?? "",
    skills: profile.skills ?? [] as string[],
    experience_years: profile.experience_years ?? 0,
    country: profile.country ?? "",
    website: profile.website ?? "",
    linkedin_url: profile.linkedin_url ?? "",
    twitter_url: profile.twitter_url ?? "",
    discord_username: profile.discord_username ?? "",
    skillInput: "",
  });

  function addSkill(skill: string) {
    const trimmed = skill.trim();
    if (!trimmed || form.skills.includes(trimmed) || form.skills.length >= 20) return;
    setForm(f => ({ ...f, skills: [...f.skills, trimmed], skillInput: "" }));
  }

  function removeSkill(skill: string) {
    setForm(f => ({ ...f, skills: (f.skills as string[]).filter((s: string) => s !== skill) }));
  }

  function handleSubmit() {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("display_name", form.display_name);
      fd.append("bio", form.bio);
      fd.append("skills", JSON.stringify(form.skills));
      fd.append("experience_years", String(form.experience_years));
      fd.append("country", form.country);
      fd.append("website", form.website);
      fd.append("linkedin_url", form.linkedin_url);
      fd.append("twitter_url", form.twitter_url);
      fd.append("discord_username", form.discord_username);

      const result = await saveProfileSetup(fd);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      {/* Background orb */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: "var(--gradient-brand)" }} />

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">{APP_NAME}</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Set up your profile</h1>
          <p className="text-muted-foreground text-sm">Takes less than 2 minutes</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            {STEPS.map((s) => (
              <span key={s.id} className={step >= s.id ? "text-primary font-medium" : ""}>
                {s.title}
              </span>
            ))}
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-brand)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Step Card */}
        <div className="rounded-2xl p-8" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >

              {/* ── Step 1: Identity ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">{STEPS[0].title}</h2>
                    <p className="text-muted-foreground text-sm">{STEPS[0].description}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="display_name">Display Name *</label>
                    <input
                      id="display_name"
                      type="text"
                      value={form.display_name}
                      onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                      placeholder="Your full name or handle"
                      className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "hsl(var(--muted))",
                        border: "1px solid hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      placeholder="Tell the community a bit about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                      style={{
                        background: "hsl(var(--muted))",
                        border: "1px solid hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{form.bio.length}/500</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="country">Country</label>
                    <select
                      id="country"
                      value={form.country}
                      onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "hsl(var(--muted))",
                        border: "1px solid hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      <option value="">Select your country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* ── Step 2: Skills ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">{STEPS[1].title}</h2>
                    <p className="text-muted-foreground text-sm">{STEPS[1].description}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range" min={0} max={20} step={1}
                        value={form.experience_years}
                        onChange={e => setForm(f => ({ ...f, experience_years: Number(e.target.value) }))}
                        className="flex-1 accent-primary"
                        id="experience_slider"
                      />
                      <span className="text-sm font-semibold w-16 text-center p-2 rounded-lg"
                        style={{ background: "hsl(var(--muted))" }}>
                        {form.experience_years === 20 ? "20+" : form.experience_years}y
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Skills & Technologies *</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={form.skillInput}
                        onChange={e => setForm(f => ({ ...f, skillInput: e.target.value }))}
                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(form.skillInput); } }}
                        placeholder="Add a skill…"
                        id="skill_input"
                        className="flex-1 h-10 px-3 rounded-xl text-sm outline-none"
                        style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                      />
                      <button onClick={() => addSkill(form.skillInput)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                        style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Selected skills */}
                    {form.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {form.skills.map(skill => (
                          <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                            style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.3)" }}>
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="hover:opacity-70">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 12).map(skill => (
                          <button key={skill} onClick={() => addSkill(skill)}
                            className="px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-80"
                            style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                            + {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Social Links ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">{STEPS[2].title}</h2>
                    <p className="text-muted-foreground text-sm">{STEPS[2].description}</p>
                  </div>

                  {[
                    { id: "website", label: "Website / Portfolio", placeholder: "https://yoursite.com" },
                    { id: "linkedin_url", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
                    { id: "twitter_url", label: "Twitter / X", placeholder: "https://x.com/..." },
                    { id: "discord_username", label: "Discord Username", placeholder: "yourname#0000" },
                  ].map(field => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                      <input
                        id={field.id}
                        type="text"
                        value={form[field.id as keyof typeof form] as string}
                        onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                        style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ── Step 4: Complete ── */}
              {step === 4 && (
                <div className="text-center space-y-6 py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: "hsl(var(--primary) / 0.15)", border: "2px solid hsl(var(--primary) / 0.3)" }}
                  >
                    <Check className="w-10 h-10" style={{ color: "hsl(var(--primary))" }} />
                  </motion.div>

                  <div>
                    <h2 className="text-xl font-bold mb-2">Profile ready, {form.display_name || "developer"}! 🚀</h2>
                    <p className="text-muted-foreground text-sm">
                      You&apos;re about to join a community of open-source builders.
                      Start by exploring trending projects or submitting your own.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    {[
                      { label: "Skills added", value: form.skills.length },
                      { label: "Experience", value: `${form.experience_years}+ years` },
                    ].map(stat => (
                      <div key={stat.label} className="p-4 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
                        <div className="text-lg font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className={`flex mt-8 ${step > 1 ? "justify-between" : "justify-end"}`}>
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={isPending}
                className="flex items-center gap-2 px-4 h-11 rounded-xl text-sm font-medium transition-colors"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                id="setup-back-btn"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={
                  (step === 1 && !form.display_name.trim()) ||
                  (step === 2 && form.skills.length === 0)
                }
                id="setup-next-btn"
                className="flex items-center gap-2 px-6 h-11 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isPending}
                id="setup-submit-btn"
                className="flex items-center gap-2 px-8 h-11 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "var(--gradient-brand)", color: "white" }}
              >
                {isPending ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving…</>
                ) : (
                  <><Zap className="w-4 h-4" /> Launch into GitBoost</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
