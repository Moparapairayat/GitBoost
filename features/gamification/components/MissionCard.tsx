"use client";

import { motion } from "framer-motion";
import { Check, Target } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/types/database.types";

type Mission = Tables<"daily_missions">;

interface MissionCardProps {
  mission: Mission;
  completed?: boolean;
  progress?: number;
  onComplete?: () => void;
  index?: number;
}

export default function MissionCard({ mission, completed = false, progress = 0, onComplete, index = 0 }: MissionCardProps) {
  const progressPercent = Math.min(Math.floor((progress / mission.action_count) * 100), 100);

  async function handleComplete() {
    if (completed) return;
    try {
      const res = await fetch("/api/v1/missions/today", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission_id: mission.id }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Mission completed! +${mission.xp_reward} XP`);
        onComplete?.();
      } else {
        toast.error(json.error || "Failed to complete mission");
      }
    } catch {
      toast.error("Failed to complete mission");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="p-5 rounded-2xl"
      style={{
        background: completed ? "hsl(var(--primary) / 0.05)" : "hsl(var(--card))",
        border: `1px solid ${completed ? "hsl(var(--primary) / 0.2)" : "hsl(var(--border))"}`,
      }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: completed ? "hsl(var(--primary) / 0.15)" : "hsl(var(--muted))", border: `1px solid ${completed ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))"}` }}>
          {completed ? (
            <Check className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
          ) : (
            <Target className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold">{mission.name}</h3>
            {completed && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                Completed
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{mission.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: completed ? "hsl(var(--primary))" : "var(--gradient-brand)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {progress}/{mission.action_count}
            </span>
            <span className="text-xs font-medium flex-shrink-0" style={{ color: "hsl(38 92% 50%)" }}>
              +{mission.xp_reward} XP
            </span>
          </div>

          {!completed && progress >= mission.action_count && (
            <button
              onClick={handleComplete}
              className="mt-3 w-full flex items-center justify-center gap-2 h-9 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
              style={{ background: "var(--gradient-brand)", color: "white" }}
            >
              <Check className="w-3.5 h-3.5" />
              Claim Reward
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
