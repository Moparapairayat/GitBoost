-- ============================================================
-- GitBoost — Migration 001: Initial Schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- for fuzzy full-text search

-- Ensure uuid_generate_v4 is available
CREATE OR REPLACE FUNCTION uuid_generate_v4() RETURNS UUID AS $$
BEGIN
  RETURN uuid_in(overlay(overlay(md5(extract(epoch FROM now())::text || random()::text) placing '4' from 13) placing 'a' from 17)::cstring);
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('user', 'pro', 'team', 'admin');
CREATE TYPE repo_status AS ENUM ('pending', 'active', 'featured', 'archived', 'rejected');
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'team');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trialing');
CREATE TYPE notification_type AS ENUM ('review', 'comment', 'badge', 'challenge', 'featured', 'announcement');
CREATE TYPE achievement_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
CREATE TYPE report_reference_type AS ENUM ('repository', 'review', 'comment', 'profile');
CREATE TYPE report_status AS ENUM ('open', 'reviewing', 'resolved', 'dismissed');
CREATE TYPE analytics_event_type AS ENUM ('profile_view', 'repo_view', 'github_click', 'demo_click', 'doc_click');

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username          VARCHAR(50) UNIQUE NOT NULL,
  display_name      VARCHAR(100),
  avatar_url        TEXT,
  bio               TEXT,
  country           VARCHAR(100),
  website           TEXT,
  github_username   VARCHAR(100),
  github_id         BIGINT UNIQUE,
  linkedin_url      TEXT,
  twitter_url       TEXT,
  discord_username  VARCHAR(100),
  skills            TEXT[] DEFAULT '{}',
  experience_years  INTEGER CHECK (experience_years >= 0 AND experience_years <= 50),
  role              user_role DEFAULT 'user' NOT NULL,
  trust_score       INTEGER DEFAULT 0 NOT NULL,
  xp                INTEGER DEFAULT 0 NOT NULL,
  level             INTEGER DEFAULT 1 NOT NULL,
  is_verified       BOOLEAN DEFAULT false NOT NULL,
  is_banned         BOOLEAN DEFAULT false NOT NULL,
  deleted_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by        UUID REFERENCES profiles(id),
  updated_by        UUID REFERENCES profiles(id)
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id            UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan                  subscription_plan DEFAULT 'free' NOT NULL,
  status                subscription_status DEFAULT 'active' NOT NULL,
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) UNIQUE NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  color       VARCHAR(7),
  sort_order  INTEGER DEFAULT 0 NOT NULL,
  is_active   BOOLEAN DEFAULT true NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- LANGUAGES
-- ============================================================
CREATE TABLE languages (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name      VARCHAR(50) UNIQUE NOT NULL,
  slug      VARCHAR(50) UNIQUE NOT NULL,
  color     VARCHAR(7),
  logo_url  TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- ============================================================
-- FRAMEWORKS
-- ============================================================
CREATE TABLE frameworks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(50) UNIQUE NOT NULL,
  slug        VARCHAR(50) UNIQUE NOT NULL,
  language_id UUID REFERENCES languages(id) ON DELETE SET NULL,
  logo_url    TEXT,
  is_active   BOOLEAN DEFAULT true NOT NULL
);

-- ============================================================
-- TAGS
-- ============================================================
CREATE TABLE tags (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(50) UNIQUE NOT NULL,
  slug        VARCHAR(50) UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0 NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- REPOSITORIES
-- ============================================================
CREATE TABLE repositories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  github_url      TEXT UNIQUE NOT NULL,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  readme_content  TEXT,
  language        VARCHAR(50),
  framework_id    UUID REFERENCES frameworks(id) ON DELETE SET NULL,
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  license         VARCHAR(100),
  website_url     TEXT,
  docs_url        TEXT,
  demo_url        TEXT,
  featured_image  TEXT,
  status          repo_status DEFAULT 'pending' NOT NULL,
  is_featured     BOOLEAN DEFAULT false NOT NULL,
  view_count      INTEGER DEFAULT 0 NOT NULL,
  github_stars    INTEGER DEFAULT 0 NOT NULL,
  github_forks    INTEGER DEFAULT 0 NOT NULL,
  github_updated  TIMESTAMPTZ,
  trending_score  FLOAT DEFAULT 0 NOT NULL,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by      UUID REFERENCES profiles(id),
  updated_by      UUID REFERENCES profiles(id)
);

-- ============================================================
-- REPOSITORY TAGS (junction)
-- ============================================================
CREATE TABLE repository_tags (
  repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  tag_id        UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (repository_id, tag_id)
);

-- ============================================================
-- REPOSITORY SCREENSHOTS
-- ============================================================
CREATE TABLE repository_screenshots (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  caption       TEXT,
  sort_order    INTEGER DEFAULT 0 NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  profile_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating_overall DECIMAL(2,1) NOT NULL CHECK (rating_overall >= 1 AND rating_overall <= 5),
  rating_code   INTEGER CHECK (rating_code >= 1 AND rating_code <= 5),
  rating_docs   INTEGER CHECK (rating_docs >= 1 AND rating_docs <= 5),
  rating_perf   INTEGER CHECK (rating_perf >= 1 AND rating_perf <= 5),
  rating_ui     INTEGER CHECK (rating_ui >= 1 AND rating_ui <= 5),
  rating_arch   INTEGER CHECK (rating_arch >= 1 AND rating_arch <= 5),
  pros          TEXT,
  cons          TEXT,
  suggestions   TEXT,
  body          TEXT,
  helpful_count INTEGER DEFAULT 0 NOT NULL,
  is_verified   BOOLEAN DEFAULT false NOT NULL,
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (repository_id, profile_id)
);

-- ============================================================
-- REVIEW VOTES
-- ============================================================
CREATE TABLE review_votes (
  review_id   UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote        BOOLEAN NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (review_id, profile_id)
);

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE TABLE comments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  profile_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id     UUID REFERENCES comments(id) ON DELETE CASCADE,
  body          TEXT NOT NULL,
  is_edited     BOOLEAN DEFAULT false NOT NULL,
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- COMMENT REACTIONS
-- ============================================================
CREATE TABLE comment_reactions (
  comment_id  UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji       VARCHAR(10) NOT NULL,
  PRIMARY KEY (comment_id, profile_id, emoji)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type            notification_type NOT NULL,
  title           VARCHAR(200) NOT NULL,
  body            TEXT,
  reference_id    UUID,
  reference_type  VARCHAR(50),
  is_read         BOOLEAN DEFAULT false NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE TABLE achievements (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code        VARCHAR(100) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  icon        TEXT,
  badge_url   TEXT,
  xp_reward   INTEGER DEFAULT 0 NOT NULL,
  rarity      achievement_rarity DEFAULT 'common' NOT NULL,
  is_active   BOOLEAN DEFAULT true NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- PROFILE ACHIEVEMENTS
-- ============================================================
CREATE TABLE profile_achievements (
  profile_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (profile_id, achievement_id)
);

-- ============================================================
-- XP TRANSACTIONS
-- ============================================================
CREATE TABLE xp_transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount          INTEGER NOT NULL,
  reason          VARCHAR(200),
  reference_id    UUID,
  reference_type  VARCHAR(50),
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- DAILY MISSIONS
-- ============================================================
CREATE TABLE daily_missions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code         VARCHAR(100) UNIQUE NOT NULL,
  name         VARCHAR(200) NOT NULL,
  description  TEXT,
  xp_reward    INTEGER DEFAULT 0 NOT NULL,
  action_type  VARCHAR(50) NOT NULL,
  action_count INTEGER DEFAULT 1 NOT NULL,
  is_active    BOOLEAN DEFAULT true NOT NULL
);

-- ============================================================
-- MISSION COMPLETIONS
-- ============================================================
CREATE TABLE mission_completions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id     UUID NOT NULL REFERENCES daily_missions(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (profile_id, mission_id, completed_date)
);

-- ============================================================
-- WEEKLY CHALLENGES
-- ============================================================
CREATE TABLE weekly_challenges (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(200) NOT NULL,
  description  TEXT,
  xp_reward    INTEGER DEFAULT 0 NOT NULL,
  starts_at    TIMESTAMPTZ NOT NULL,
  ends_at      TIMESTAMPTZ NOT NULL,
  action_type  VARCHAR(50) NOT NULL,
  action_count INTEGER DEFAULT 1 NOT NULL,
  is_active    BOOLEAN DEFAULT true NOT NULL
);

-- ============================================================
-- CHALLENGE COMPLETIONS
-- ============================================================
CREATE TABLE challenge_completions (
  profile_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (profile_id, challenge_id)
);

-- ============================================================
-- ANALYTICS EVENTS
-- ============================================================
CREATE TABLE analytics_events (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  profile_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type    analytics_event_type NOT NULL,
  source        VARCHAR(100),
  ip_hash       VARCHAR(64),
  user_agent    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- REPORTS
-- ============================================================
CREATE TABLE reports (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reference_id    UUID NOT NULL,
  reference_type  report_reference_type NOT NULL,
  reason          VARCHAR(200),
  body            TEXT,
  status          report_status DEFAULT 'open' NOT NULL,
  resolved_by     UUID REFERENCES profiles(id),
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
CREATE TABLE announcements (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         VARCHAR(200) NOT NULL,
  body          TEXT,
  is_published  BOOLEAN DEFAULT false NOT NULL,
  published_at  TIMESTAMPTZ,
  created_by    UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      VARCHAR(100) NOT NULL,
  table_name  VARCHAR(100),
  record_id   UUID,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Profiles
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_github_id ON profiles(github_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_xp ON profiles(xp DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_fts ON profiles USING gin(
  to_tsvector('english', username || ' ' || COALESCE(display_name, ''))
);

-- Repositories
CREATE INDEX idx_repos_profile ON repositories(profile_id);
CREATE INDEX idx_repos_status ON repositories(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_repos_category ON repositories(category_id);
CREATE INDEX idx_repos_language ON repositories(language);
CREATE INDEX idx_repos_created ON repositories(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_repos_views ON repositories(view_count DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_repos_trending ON repositories(trending_score DESC) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX idx_repos_featured ON repositories(is_featured) WHERE is_featured = true AND deleted_at IS NULL;
CREATE INDEX idx_repos_fts ON repositories USING gin(
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- Reviews
CREATE INDEX idx_reviews_repo ON reviews(repository_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_reviews_profile ON reviews(profile_id) WHERE deleted_at IS NULL;

-- Comments
CREATE INDEX idx_comments_repo ON comments(repository_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_parent ON comments(parent_id) WHERE parent_id IS NOT NULL;

-- Notifications
CREATE INDEX idx_notifs_profile ON notifications(profile_id, created_at DESC);
CREATE INDEX idx_notifs_unread ON notifications(profile_id, is_read) WHERE is_read = false;

-- Analytics
CREATE INDEX idx_events_repo_type ON analytics_events(repository_id, event_type, created_at DESC);
CREATE INDEX idx_events_profile ON analytics_events(profile_id, created_at DESC);

-- XP Transactions
CREATE INDEX idx_xp_profile ON xp_transactions(profile_id, created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_repositories_updated_at BEFORE UPDATE ON repositories
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
