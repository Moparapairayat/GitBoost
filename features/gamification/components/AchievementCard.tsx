"use client";

import { motion } from "framer-motion";
import type { Tables } from "@/types/database.types";

type Achievement = Tables<"achievements">;

interface AchievementCardProps {
  achievement: Achievement;
  earned?: boolean;
  earnedAt?: string;
  index?: number;
}

const RARITY_COLORS: Record<string, string> = {
  common: "hsl(142 71% 45%)",
  uncommon: "hsl(217 91% 60%)",
  rare: "hsl(263 70% 65%)",
  epic: "hsl(300 60% 65%)",
  legendary: "hsl(38 92% 50%)",
};

export default function AchievementCard({ achievement, earned = false, earnedAt, index = 0 }: AchievementCardProps) {
  const rarityColor = RARITY_COLORS[achievement.rarity] || "hsl(var(--muted-foreground))";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="p-5 rounded-2xl transition-all"
      style={{
        background: earned ? "hsl(var(--card))" : "hsl(var(--muted))",
        border: `1px solid ${earned ? rarityColor + "40" : "hsl(var(--border))"}`,
        opacity: earned ? 1 : 0.6,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${rarityColor}15`, border: `1px solid ${rarityColor}30` }}
        >
          {achievement.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold truncate">{achievement.name}</h3>
            {earned && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${rarityColor}20`, color: rarityColor }}>
                Earned
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{achievement.description}</p>

          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}>
              +{achievement.xp_reward} XP
            </span>
            <span className="text-xs capitalize" style={{ color: rarityColor }}>
              {achievement.rarity}
            </span>
            {earned && earnedAt && (
              <span className="text-xs text-muted-foreground">
                {new Date(earnedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
