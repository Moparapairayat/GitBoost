export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          country: string | null;
          website: string | null;
          github_username: string | null;
          github_id: number | null;
          linkedin_url: string | null;
          twitter_url: string | null;
          discord_username: string | null;
          skills: string[] | null;
          experience_years: number | null;
          role: "user" | "pro" | "team" | "admin";
          trust_score: number;
          xp: number;
          level: number;
          is_verified: boolean;
          is_banned: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          country?: string | null;
          website?: string | null;
          github_username?: string | null;
          github_id?: number | null;
          linkedin_url?: string | null;
          twitter_url?: string | null;
          discord_username?: string | null;
          skills?: string[] | null;
          experience_years?: number | null;
          role?: "user" | "pro" | "team" | "admin";
          trust_score?: number;
          xp?: number;
          level?: number;
          is_verified?: boolean;
          is_banned?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      repositories: {
        Row: {
          id: string;
          profile_id: string;
          github_url: string;
          title: string;
          description: string | null;
          readme_content: string | null;
          language: string | null;
          framework_id: string | null;
          category_id: string | null;
          license: string | null;
          website_url: string | null;
          docs_url: string | null;
          demo_url: string | null;
          featured_image: string | null;
          status: "pending" | "active" | "featured" | "archived" | "rejected";
          is_featured: boolean;
          view_count: number;
          github_stars: number;
          github_forks: number;
          github_updated: string | null;
          trending_score: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          profile_id: string;
          github_url: string;
          title: string;
          description?: string | null;
          readme_content?: string | null;
          language?: string | null;
          framework_id?: string | null;
          category_id?: string | null;
          license?: string | null;
          website_url?: string | null;
          docs_url?: string | null;
          demo_url?: string | null;
          featured_image?: string | null;
          status?: "pending" | "active" | "featured" | "archived" | "rejected";
          is_featured?: boolean;
          view_count?: number;
          github_stars?: number;
          github_forks?: number;
          github_updated?: string | null;
          trending_score?: number;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["repositories"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          usage_count: number;
          created_at: string;
        };
        Insert: { id?: string; name: string; slug: string; usage_count?: number; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["tags"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          repository_id: string;
          profile_id: string;
          rating_overall: number;
          rating_code: number | null;
          rating_docs: number | null;
          rating_perf: number | null;
          rating_ui: number | null;
          rating_arch: number | null;
          pros: string | null;
          cons: string | null;
          suggestions: string | null;
          body: string | null;
          helpful_count: number;
          is_verified: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          repository_id: string;
          profile_id: string;
          rating_overall: number;
          rating_code?: number | null;
          rating_docs?: number | null;
          rating_perf?: number | null;
          rating_ui?: number | null;
          rating_arch?: number | null;
          pros?: string | null;
          cons?: string | null;
          suggestions?: string | null;
          body?: string | null;
          helpful_count?: number;
          is_verified?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          profile_id: string;
          type: "review" | "comment" | "badge" | "challenge" | "featured" | "announcement";
          title: string;
          body: string | null;
          reference_id: string | null;
          reference_type: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          type: "review" | "comment" | "badge" | "challenge" | "featured" | "announcement";
          title: string;
          body?: string | null;
          reference_id?: string | null;
          reference_type?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      achievements: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          icon: string | null;
          badge_url: string | null;
          xp_reward: number;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          badge_url?: string | null;
          xp_reward?: number;
          rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
      };
      profile_achievements: {
        Row: { profile_id: string; achievement_id: string; earned_at: string };
        Insert: { profile_id: string; achievement_id: string; earned_at?: string };
        Update: Partial<Database["public"]["Tables"]["profile_achievements"]["Insert"]>;
      };
      xp_transactions: {
        Row: {
          id: string;
          profile_id: string;
          amount: number;
          reason: string | null;
          reference_id: string | null;
          reference_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          amount: number;
          reason?: string | null;
          reference_id?: string | null;
          reference_type?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["xp_transactions"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          profile_id: string;
          plan: "free" | "pro" | "team";
          status: "active" | "cancelled" | "expired" | "trialing";
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          plan?: "free" | "pro" | "team";
          status?: "active" | "cancelled" | "expired" | "trialing";
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
