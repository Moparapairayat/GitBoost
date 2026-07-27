"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  profile_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  rank: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const RANK_ICONS = {
  1: Trophy,
  2: Medal,
  3: Award,
};

const RANK_COLORS = {
  1: "hsl(38 92% 50%)",
  2: "hsl(217 91% 60%)",
  3: "hsl(263 70% 65%)",
};

export default function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  return (
    <div className="space-y-3">
      {entries.map((entry, i) => {
        const RankIcon = RANK_ICONS[entry.rank as keyof typeof RANK_ICONS];
        const rankColor = RANK_COLORS[entry.rank as keyof typeof RANK_COLORS] || "hsl(var(--muted-foreground))";
        const isCurrentUser = currentUserId === entry.profile_id;

        return (
          <motion.div
            key={entry.profile_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-xl transition-all"
            style={{
              background: isCurrentUser ? "hsl(var(--primary) / 0.05)" : "hsl(var(--card))",
              border: `1px solid ${isCurrentUser ? "hsl(var(--primary) / 0.2)" : "hsl(var(--border))"}`,
            }}
          >
            <div className="w-8 text-center flex-shrink-0">
              {RankIcon ? (
                <RankIcon className="w-5 h-5 mx-auto" style={{ color: rankColor }} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
              )}
            </div>

            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: "var(--gradient-brand)", color: "white" }}>
              {(entry.display_name ?? entry.username).charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {entry.display_name ?? entry.username}
                {isCurrentUser && <span className="text-xs text-muted-foreground ml-2">(You)</span>}
              </p>
              <p className="text-xs text-muted-foreground">@{entry.username} · Level {entry.level}</p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold" style={{ color: "hsl(38 92% 50%)" }}>
                {entry.xp.toLocaleString()} XP
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
