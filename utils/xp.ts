// XP required to reach each level (cumulative)
const LEVEL_XP_THRESHOLDS = Array.from({ length: 100 }, (_, i) => {
  const level = i + 1;
  return Math.floor(100 * Math.pow(level, 1.5));
});

const LEVEL_NAMES: Record<number, string> = {
  1: "Newcomer",
  5: "Explorer",
  10: "Contributor",
  20: "Builder",
  30: "Craftsman",
  40: "Engineer",
  50: "Architect",
  60: "Senior",
  70: "Principal",
  80: "Distinguished",
  90: "Fellow",
  100: "Legend",
};

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_XP_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_XP_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return Math.min(level, 100);
}

export function getXPForLevel(level: number): number {
  return LEVEL_XP_THRESHOLDS[Math.min(level - 1, 99)];
}

export function getXPForNextLevel(level: number): number {
  if (level >= 100) return LEVEL_XP_THRESHOLDS[99];
  return LEVEL_XP_THRESHOLDS[level];
}

export function getLevelName(level: number): string {
  const milestone = Object.keys(LEVEL_NAMES)
    .map(Number)
    .filter((m) => level >= m)
    .sort((a, b) => b - a)[0];
  return LEVEL_NAMES[milestone] ?? "Newcomer";
}

export function getXPProgress(
  xp: number,
  level: number
): { current: number; required: number; percentage: number } {
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForNextLevel(level);
  const current = xp - currentLevelXP;
  const required = nextLevelXP - currentLevelXP;
  const percentage = Math.min(Math.floor((current / required) * 100), 100);
  return { current, required, percentage };
}

// XP awards per action
export const XP_AWARDS = {
  SUBMIT_REPOSITORY: 50,
  REPOSITORY_APPROVED: 100,
  WRITE_REVIEW: 25,
  RECEIVE_REVIEW: 10,
  HELPFUL_VOTE_RECEIVED: 5,
  WRITE_COMMENT: 5,
  DAILY_LOGIN: 10,
  COMPLETE_DAILY_MISSION: 30,
  COMPLETE_WEEKLY_CHALLENGE: 100,
  PROFILE_COMPLETE: 50,
} as const;
