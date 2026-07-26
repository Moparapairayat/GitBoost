import { Tables } from "./database.types";

export type Profile = Tables<"profiles">;

export type ProfileWithStats = Profile & {
  repository_count: number;
  review_count: number;
  level_name: string;
  next_level_xp: number;
};

export type PublicProfile = Pick<
  Profile,
  | "id"
  | "username"
  | "display_name"
  | "avatar_url"
  | "bio"
  | "country"
  | "website"
  | "github_username"
  | "linkedin_url"
  | "twitter_url"
  | "discord_username"
  | "skills"
  | "experience_years"
  | "role"
  | "trust_score"
  | "xp"
  | "level"
  | "is_verified"
  | "created_at"
>;
