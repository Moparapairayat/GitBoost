-- ============================================================
-- GitBoost — Migration 003: Functions, Triggers & RPC
-- ============================================================

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGN-UP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  github_username TEXT;
  github_avatar   TEXT;
  github_id_val   BIGINT;
  raw_username    TEXT;
  final_username  TEXT;
  counter         INT := 0;
BEGIN
  -- Extract GitHub data from raw_user_meta_data
  github_username := NEW.raw_user_meta_data->>'user_name';
  github_avatar   := NEW.raw_user_meta_data->>'avatar_url';
  github_id_val   := (NEW.raw_user_meta_data->>'provider_id')::BIGINT;

  -- Build a unique username
  raw_username := LOWER(REGEXP_REPLACE(COALESCE(github_username, SPLIT_PART(NEW.email, '@', 1)), '[^a-z0-9_]', '_', 'g'));
  final_username := raw_username;

  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE username = final_username);
    counter := counter + 1;
    final_username := raw_username || counter::TEXT;
  END LOOP;

  -- Insert new profile
  INSERT INTO profiles (
    id, username, display_name, avatar_url, github_username, github_id
  ) VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', github_username),
    github_avatar,
    github_username,
    github_id_val
  );

  -- Create default free subscription
  INSERT INTO subscriptions (profile_id, plan, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (profile_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ============================================================
-- XP AWARD FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION award_xp(
  p_profile_id    UUID,
  p_amount        INTEGER,
  p_reason        VARCHAR(200),
  p_reference_id  UUID DEFAULT NULL,
  p_reference_type VARCHAR(50) DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  new_xp    INTEGER;
  new_level INTEGER;
BEGIN
  -- Record transaction
  INSERT INTO xp_transactions (profile_id, amount, reason, reference_id, reference_type)
  VALUES (p_profile_id, p_amount, p_reason, p_reference_id, p_reference_type);

  -- Update profile XP
  UPDATE profiles
  SET xp = xp + p_amount,
      level = LEAST(FLOOR(POW((xp + p_amount) / 100.0, 1.0/1.5))::INTEGER + 1, 100),
      updated_at = now()
  WHERE id = p_profile_id
  RETURNING xp, level INTO new_xp, new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TRENDING SCORE CALCULATION
-- ============================================================
CREATE OR REPLACE FUNCTION calculate_trending_score(repo_id UUID)
RETURNS FLOAT AS $$
DECLARE
  v_views       INTEGER;
  v_reviews     INTEGER;
  v_comments    INTEGER;
  v_helpful     INTEGER;
  v_stars_delta INTEGER;
  v_days_old    FLOAT;
  v_score       FLOAT;
BEGIN
  SELECT
    COALESCE(SUM(CASE WHEN event_type = 'repo_view' AND created_at > now() - INTERVAL '7 days' THEN 1 ELSE 0 END), 0),
    0,
    0
  INTO v_views, v_reviews, v_comments
  FROM analytics_events
  WHERE repository_id = repo_id;

  SELECT COUNT(*) INTO v_reviews
  FROM reviews
  WHERE repository_id = repo_id AND created_at > now() - INTERVAL '7 days' AND deleted_at IS NULL;

  SELECT COUNT(*) INTO v_comments
  FROM comments
  WHERE repository_id = repo_id AND created_at > now() - INTERVAL '7 days' AND deleted_at IS NULL;

  SELECT COALESCE(SUM(CASE WHEN vote = true THEN 1 ELSE 0 END), 0) INTO v_helpful
  FROM review_votes rv
  JOIN reviews r ON rv.review_id = r.id
  WHERE r.repository_id = repo_id AND rv.created_at > now() - INTERVAL '7 days';

  SELECT EXTRACT(EPOCH FROM (now() - created_at)) / 86400.0 INTO v_days_old
  FROM repositories WHERE id = repo_id;

  v_score := (
    (v_views * 1.0) +
    (v_reviews * 5.0) +
    (v_comments * 2.0) +
    (v_helpful * 3.0)
  ) * (1.0 / (1.0 + v_days_old * 0.1));

  RETURN GREATEST(v_score, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- INCREMENT VIEW COUNT (SAFE, RATE-LIMITED BY IP HASH)
-- ============================================================
CREATE OR REPLACE FUNCTION increment_repo_view(
  p_repo_id     UUID,
  p_ip_hash     VARCHAR(64),
  p_actor_id    UUID DEFAULT NULL,
  p_source      VARCHAR(100) DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Only count if this IP hasn't viewed in last hour
  IF NOT EXISTS (
    SELECT 1 FROM analytics_events
    WHERE repository_id = p_repo_id
      AND ip_hash = p_ip_hash
      AND event_type = 'repo_view'
      AND created_at > now() - INTERVAL '1 hour'
  ) THEN
    INSERT INTO analytics_events (repository_id, profile_id, actor_id, event_type, ip_hash, source)
    VALUES (p_repo_id, NULL, p_actor_id, 'repo_view', p_ip_hash, p_source);

    UPDATE repositories SET view_count = view_count + 1 WHERE id = p_repo_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- GRANT ACHIEVEMENT (IDEMPOTENT)
-- ============================================================
CREATE OR REPLACE FUNCTION grant_achievement(
  p_profile_id     UUID,
  p_achievement_code VARCHAR(100)
)
RETURNS BOOLEAN AS $$
DECLARE
  v_achievement_id  UUID;
  v_xp_reward       INTEGER;
  v_name            TEXT;
BEGIN
  SELECT id, xp_reward, name INTO v_achievement_id, v_xp_reward, v_name
  FROM achievements WHERE code = p_achievement_code AND is_active = true;

  IF v_achievement_id IS NULL THEN
    RETURN false;
  END IF;

  -- Idempotent insert
  INSERT INTO profile_achievements (profile_id, achievement_id)
  VALUES (p_profile_id, v_achievement_id)
  ON CONFLICT (profile_id, achievement_id) DO NOTHING;

  IF FOUND THEN
    -- Award XP
    PERFORM award_xp(p_profile_id, v_xp_reward, 'Achievement: ' || v_name, v_achievement_id, 'achievement');

    -- Send notification
    INSERT INTO notifications (profile_id, type, title, body, reference_id, reference_type)
    VALUES (p_profile_id, 'badge', '🏆 Achievement Unlocked: ' || v_name, NULL, v_achievement_id, 'achievement');

    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SEED: DEFAULT ACHIEVEMENTS
-- ============================================================
INSERT INTO achievements (code, name, description, icon, xp_reward, rarity) VALUES
  ('first_login',        'Welcome!',            'Signed in for the first time',              '👋', 10,  'common'),
  ('profile_complete',   'Identity Established','Completed your developer profile',           '✅', 50,  'common'),
  ('first_repo',         'Open Sourcer',        'Submitted your first repository',            '🚀', 100, 'common'),
  ('first_review',       'Code Reviewer',       'Wrote your first review',                   '⭐', 25,  'common'),
  ('five_reviews',       'Critic',              'Wrote 5 reviews',                           '📝', 75,  'uncommon'),
  ('ten_reviews',        'Senior Reviewer',     'Wrote 10 reviews',                          '🔍', 150, 'uncommon'),
  ('helpful_reviewer',   'Community Helper',    'Received 10 helpful votes on your reviews', '💡', 100, 'uncommon'),
  ('five_repos',         'Prolific Builder',    'Submitted 5 repositories',                  '🏗️', 200, 'rare'),
  ('level_10',           'Rising Star',         'Reached Level 10',                          '⭐', 200, 'uncommon'),
  ('level_25',           'Contributor',         'Reached Level 25',                          '🌟', 500, 'rare'),
  ('level_50',           'Architect',           'Reached Level 50',                          '💫', 1000,'epic'),
  ('level_100',          'Legend',              'Reached the maximum level',                 '👑', 5000,'legendary'),
  ('week_streak_7',      'Consistent',          'Active for 7 days in a row',                '🔥', 150, 'uncommon'),
  ('week_streak_30',     'Dedicated',           'Active for 30 days in a row',               '🔥', 500, 'rare'),
  ('first_comment',      'Conversationalist',   'Left your first comment',                   '💬', 10,  'common'),
  ('featured_repo',      'Spotlight',           'Had a repository featured',                 '🌟', 300, 'rare')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- SEED: DEFAULT CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, icon, color, sort_order) VALUES
  ('Web Development',     'web-development',     '🌐', '#6366f1', 1),
  ('Mobile',              'mobile',              '📱', '#8b5cf6', 2),
  ('DevTools',            'devtools',            '🔧', '#ec4899', 3),
  ('AI & ML',             'ai-ml',               '🤖', '#f59e0b', 4),
  ('Databases',           'databases',           '🗄️', '#10b981', 5),
  ('Security',            'security',            '🔒', '#ef4444', 6),
  ('CLI Tools',           'cli-tools',           '⌨️', '#6b7280', 7),
  ('Libraries',           'libraries',           '📦', '#3b82f6', 8),
  ('Frameworks',          'frameworks',          '🏗️', '#f97316', 9),
  ('APIs & SDKs',         'apis-sdks',           '🔌', '#84cc16', 10),
  ('Documentation',       'documentation',       '📚', '#06b6d4', 11),
  ('Open Source Tools',   'open-source-tools',   '🛠️', '#a855f7', 12)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: DEFAULT LANGUAGES
-- ============================================================
INSERT INTO languages (name, slug, color) VALUES
  ('TypeScript', 'typescript', '#3178c6'),
  ('JavaScript', 'javascript', '#f7df1e'),
  ('Python',     'python',     '#3572A5'),
  ('Rust',       'rust',       '#dea584'),
  ('Go',         'go',         '#00ADD8'),
  ('Java',       'java',       '#b07219'),
  ('C++',        'cpp',        '#f34b7d'),
  ('C',          'c',          '#555555'),
  ('Ruby',       'ruby',       '#701516'),
  ('PHP',        'php',        '#4F5D95'),
  ('Swift',      'swift',      '#F05138'),
  ('Kotlin',     'kotlin',     '#A97BFF'),
  ('Dart',       'dart',       '#00B4AB'),
  ('C#',         'csharp',     '#178600'),
  ('Zig',        'zig',        '#ec915c'),
  ('Elixir',     'elixir',     '#6e4a7e'),
  ('Haskell',    'haskell',    '#5e5086'),
  ('Scala',      'scala',      '#c22d40')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: DEFAULT DAILY MISSIONS
-- ============================================================
INSERT INTO daily_missions (code, name, description, xp_reward, action_type, action_count) VALUES
  ('daily_login',       'Daily Check-in',      'Log in to GitBoost today',               10,  'login',       1),
  ('write_review',      'Code Reviewer',       'Write a review for any repository',       25,  'review',      1),
  ('leave_comment',     'Start a Conversation','Leave a comment on a repository',         10,  'comment',     1),
  ('explore_repos',     'Explorer',            'View 5 different repositories today',     15,  'view_repo',   5),
  ('vote_helpful',      'Be Helpful',          'Mark 3 reviews as helpful',               10,  'vote',        3)
ON CONFLICT (code) DO NOTHING;
