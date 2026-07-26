export const APP_NAME = "GitBoost";
export const APP_TAGLINE = "Discover Great Projects. Connect With Developers. Grow Organically.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://gitboost.dev";

export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/auth/signin",
  AUTH_CALLBACK: "/auth/callback",
  PROFILE_SETUP: "/auth/setup",
  DASHBOARD: "/dashboard",
  EXPLORE: "/explore",
  TRENDING: "/explore/trending",
  LATEST: "/explore/latest",
  RECOMMENDED: "/explore/recommended",
  SEARCH: "/search",
  PRICING: "/pricing",
  ADMIN: "/admin",
} as const;

export const PLAN_LIMITS = {
  free: { repositories: 3, analytics_days: 7 },
  pro: { repositories: Infinity, analytics_days: 90 },
  team: { repositories: Infinity, analytics_days: 365 },
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const REPO_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  FEATURED: "featured",
  ARCHIVED: "archived",
  REJECTED: "rejected",
} as const;

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  "C#": "#178600",
  Zig: "#ec915c",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Scala: "#c22d40",
};
