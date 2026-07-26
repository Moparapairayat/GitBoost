-- ============================================================
-- GitBoost — Migration 002: Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE repository_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE repository_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function to check if admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (deleted_at IS NULL AND is_banned = false);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (is_admin());

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE POLICY "subscriptions_select_own" ON subscriptions
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "subscriptions_admin_all" ON subscriptions
  FOR ALL USING (is_admin());

-- ============================================================
-- REPOSITORIES
-- ============================================================
CREATE POLICY "repos_select_public" ON repositories
  FOR SELECT USING (status IN ('active', 'featured') AND deleted_at IS NULL);

CREATE POLICY "repos_select_own_all" ON repositories
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "repos_insert_authenticated" ON repositories
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND profile_id = auth.uid());

CREATE POLICY "repos_update_own" ON repositories
  FOR UPDATE USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "repos_delete_own" ON repositories
  FOR DELETE USING (profile_id = auth.uid());

CREATE POLICY "repos_admin_all" ON repositories
  FOR ALL USING (is_admin());

-- ============================================================
-- REPOSITORY TAGS
-- ============================================================
CREATE POLICY "repo_tags_select_public" ON repository_tags
  FOR SELECT USING (true);

CREATE POLICY "repo_tags_manage_own" ON repository_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM repositories WHERE id = repository_tags.repository_id AND profile_id = auth.uid())
  );

CREATE POLICY "repo_tags_admin_all" ON repository_tags
  FOR ALL USING (is_admin());

-- ============================================================
-- REPOSITORY SCREENSHOTS
-- ============================================================
CREATE POLICY "screenshots_select_public" ON repository_screenshots
  FOR SELECT USING (true);

CREATE POLICY "screenshots_manage_own" ON repository_screenshots
  FOR ALL USING (
    EXISTS (SELECT 1 FROM repositories WHERE id = repository_screenshots.repository_id AND profile_id = auth.uid())
  );

-- ============================================================
-- CATEGORIES / LANGUAGES / FRAMEWORKS / TAGS (read-only for users)
-- ============================================================
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "categories_admin_all" ON categories FOR ALL USING (is_admin());

CREATE POLICY "languages_select_all" ON languages FOR SELECT USING (is_active = true);
CREATE POLICY "languages_admin_all" ON languages FOR ALL USING (is_admin());

CREATE POLICY "frameworks_select_all" ON frameworks FOR SELECT USING (is_active = true);
CREATE POLICY "frameworks_admin_all" ON frameworks FOR ALL USING (is_admin());

CREATE POLICY "tags_select_all" ON tags FOR SELECT USING (true);
CREATE POLICY "tags_insert_authenticated" ON tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "tags_admin_all" ON tags FOR ALL USING (is_admin());

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE POLICY "reviews_select_public" ON reviews
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "reviews_insert_authenticated" ON reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND profile_id = auth.uid());

CREATE POLICY "reviews_update_own" ON reviews
  FOR UPDATE USING (profile_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "reviews_delete_own" ON reviews
  FOR DELETE USING (profile_id = auth.uid());

CREATE POLICY "reviews_admin_all" ON reviews
  FOR ALL USING (is_admin());

-- ============================================================
-- REVIEW VOTES
-- ============================================================
CREATE POLICY "review_votes_select_public" ON review_votes FOR SELECT USING (true);
CREATE POLICY "review_votes_manage_own" ON review_votes
  FOR ALL USING (profile_id = auth.uid());

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE POLICY "comments_select_public" ON comments
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "comments_insert_authenticated" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND profile_id = auth.uid());

CREATE POLICY "comments_update_own" ON comments
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "comments_delete_own" ON comments
  FOR DELETE USING (profile_id = auth.uid());

CREATE POLICY "comments_admin_all" ON comments
  FOR ALL USING (is_admin());

-- ============================================================
-- COMMENT REACTIONS
-- ============================================================
CREATE POLICY "reactions_select_public" ON comment_reactions FOR SELECT USING (true);
CREATE POLICY "reactions_manage_own" ON comment_reactions
  FOR ALL USING (profile_id = auth.uid());

-- ============================================================
-- NOTIFICATIONS (private — own profile only)
-- ============================================================
CREATE POLICY "notifications_own" ON notifications
  FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "notifications_admin_all" ON notifications
  FOR ALL USING (is_admin());

-- ============================================================
-- ACHIEVEMENTS (public read)
-- ============================================================
CREATE POLICY "achievements_select_public" ON achievements
  FOR SELECT USING (is_active = true);
CREATE POLICY "achievements_admin_all" ON achievements
  FOR ALL USING (is_admin());

-- ============================================================
-- PROFILE ACHIEVEMENTS
-- ============================================================
CREATE POLICY "profile_achievements_select_public" ON profile_achievements
  FOR SELECT USING (true);
CREATE POLICY "profile_achievements_own" ON profile_achievements
  FOR INSERT WITH CHECK (profile_id = auth.uid());

-- ============================================================
-- XP TRANSACTIONS (own read only)
-- ============================================================
CREATE POLICY "xp_transactions_own" ON xp_transactions
  FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "xp_transactions_admin_all" ON xp_transactions
  FOR ALL USING (is_admin());

-- ============================================================
-- MISSIONS & CHALLENGES (public read)
-- ============================================================
CREATE POLICY "daily_missions_select_public" ON daily_missions
  FOR SELECT USING (is_active = true);
CREATE POLICY "daily_missions_admin_all" ON daily_missions
  FOR ALL USING (is_admin());

CREATE POLICY "mission_completions_own" ON mission_completions
  FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "weekly_challenges_select_public" ON weekly_challenges
  FOR SELECT USING (is_active = true);
CREATE POLICY "weekly_challenges_admin_all" ON weekly_challenges
  FOR ALL USING (is_admin());

CREATE POLICY "challenge_completions_own" ON challenge_completions
  FOR ALL USING (profile_id = auth.uid());

-- ============================================================
-- ANALYTICS EVENTS (insert only for users)
-- ============================================================
CREATE POLICY "analytics_insert_all" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "analytics_admin_all" ON analytics_events
  FOR ALL USING (is_admin());

-- Repo owners can read their own analytics
CREATE POLICY "analytics_select_own_repo" ON analytics_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM repositories WHERE id = analytics_events.repository_id AND profile_id = auth.uid())
  );

CREATE POLICY "analytics_select_own_profile" ON analytics_events
  FOR SELECT USING (profile_id = auth.uid());

-- ============================================================
-- REPORTS
-- ============================================================
CREATE POLICY "reports_insert_authenticated" ON reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND reporter_id = auth.uid());

CREATE POLICY "reports_select_own" ON reports
  FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "reports_admin_all" ON reports
  FOR ALL USING (is_admin());

-- ============================================================
-- ANNOUNCEMENTS (public read if published)
-- ============================================================
CREATE POLICY "announcements_select_public" ON announcements
  FOR SELECT USING (is_published = true);

CREATE POLICY "announcements_admin_all" ON announcements
  FOR ALL USING (is_admin());

-- ============================================================
-- AUDIT LOGS (admin only)
-- ============================================================
CREATE POLICY "audit_logs_admin_all" ON audit_logs
  FOR ALL USING (is_admin());
