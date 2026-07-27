"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { getLevelName, getXPProgress } from "@/utils/xp";

interface XPProgressProps {
  xp: number;
  level: number;
  size?: "sm" | "md" | "lg";
}

export default function XPProgress({ xp, level, size = "md" }: XPProgressProps) {
  const progress = getXPProgress(xp, level);
  const levelName = getLevelName(level);

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" style={{ color: "hsl(38 92% 50%)" }} />
          <span className={`font-semibold ${textSizes[size]}`}>Level {level}</span>
          <span className={`text-muted-foreground ${textSizes[size]}`}>{levelName}</span>
        </div>
        <span className={`text-muted-foreground ${textSizes[size]}`}>
          {xp.toLocaleString()} XP
        </span>
      </div>

      <div className={`w-full rounded-full overflow-hidden ${sizeClasses[size]}`} style={{ background: "hsl(var(--muted))" }}>
        <motion.div
          className={`h-full rounded-full ${sizeClasses[size]}`}
          style={{ background: "var(--gradient-brand)" }}
          initial={{ width: 0 }}
          animate={{ width: `${progress.percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className={`flex justify-between mt-1.5 text-muted-foreground ${textSizes[size]}`}>
        <span>{progress.current.toLocaleString()} / {progress.required.toLocaleString()} XP</span>
        <span>{progress.percentage}% to Level {level + 1}</span>
      </div>
    </div>
  );
}
