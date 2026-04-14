-- KTPBA Teams Marathon 2026 Core Schema

-- 1. Teams
CREATE TABLE IF NOT EXISTS teams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  color_hex text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Players (Secrecy: Frontend Denied)
CREATE TABLE IF NOT EXISTS players (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  is_active boolean DEFAULT true
);

-- 3. Weeks
CREATE TABLE IF NOT EXISTS weeks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number int NOT NULL,
  play_date date NOT NULL,
  day_of_week text,
  venue text,
  status text CHECK (status IN ('scheduled', 'live', 'completed')) DEFAULT 'scheduled'
);

-- 4. Matchups
CREATE TABLE IF NOT EXISTS matchups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  week_id uuid REFERENCES weeks(id) ON DELETE CASCADE,
  home_team_id uuid REFERENCES teams(id),
  away_team_id uuid REFERENCES teams(id),
  lane_pair text,
  status text CHECK (status IN ('tbd', 'scheduled', 'live', 'done')) DEFAULT 'scheduled',
  summary text -- For AI Match Summary
);

-- 5. Format Matches (Singles, Doubles, Teams)
CREATE TABLE IF NOT EXISTS format_matches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  matchup_id uuid REFERENCES matchups(id) ON DELETE CASCADE,
  format text CHECK (format IN ('singles', 'doubles', 'teams')),
  home_wins int DEFAULT 0,
  away_wins int DEFAULT 0,
  winner_team_id uuid REFERENCES teams(id),
  status text DEFAULT 'scheduled'
);

-- 6. Individual Games (Roll-offs included)
CREATE TABLE IF NOT EXISTS games (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  format_match_id uuid REFERENCES format_matches(id) ON DELETE CASCADE,
  game_number int NOT NULL,
  home_score int,
  away_score int,
  winner_team_id uuid REFERENCES teams(id),
  is_rolloff boolean DEFAULT false,
  entered_at timestamp with time zone DEFAULT now()
);

-- 7. Participation Logic (Admin only)
CREATE TABLE IF NOT EXISTS player_participation (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  format text,
  game_number int
);

-- 8. Baker Lineups (Admin only)
CREATE TABLE IF NOT EXISTS baker_lineups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  frame_position int CHECK (frame_position BETWEEN 1 AND 5)
);

-- 9. Sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  logo_url text,
  tier text,
  is_active boolean DEFAULT true
);

-- 10. REAL-TIME STANDINGS VIEW
CREATE OR REPLACE VIEW team_standings AS
SELECT
  t.id as team_id,
  t.name,
  t.slug,
  COALESCE(SUM(CASE WHEN mu.home_team_id = t.id THEN g.home_score ELSE 0 END), 0) +
  COALESCE(SUM(CASE WHEN mu.away_team_id = t.id THEN g.away_score ELSE 0 END), 0) AS total_pinfall,
  COALESCE(SUM(CASE WHEN fm.format = 'singles' AND mu.home_team_id = t.id THEN g.home_score 
                    WHEN fm.format = 'singles' AND mu.away_team_id = t.id THEN g.away_score ELSE 0 END), 0) AS singles_pinfall,
  COALESCE(SUM(CASE WHEN fm.format = 'doubles' AND mu.home_team_id = t.id THEN g.home_score 
                    WHEN fm.format = 'doubles' AND mu.away_team_id = t.id THEN g.away_score ELSE 0 END), 0) AS doubles_pinfall,
  COALESCE(SUM(CASE WHEN fm.format = 'teams' AND mu.home_team_id = t.id THEN g.home_score 
                    WHEN fm.format = 'teams' AND mu.away_team_id = t.id THEN g.away_score ELSE 0 END), 0) AS teams_pinfall
FROM teams t
LEFT JOIN matchups mu ON (mu.home_team_id = t.id OR mu.away_team_id = t.id)
LEFT JOIN format_matches fm ON fm.matchup_id = mu.id
LEFT JOIN games g ON g.format_match_id = fm.id
WHERE t.is_active = TRUE
GROUP BY t.id, t.name, t.slug
ORDER BY total_pinfall DESC;

-- Grant access to the view
GRANT SELECT ON team_standings TO anon, authenticated;

-- SECURITY: Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE baker_lineups ENABLE ROW LEVEL SECURITY;

-- Allow public read for teams, scores, schedule
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public teams are viewable by everyone" ON teams FOR SELECT USING (true);

ALTER TABLE matchups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public matchups are viewable by everyone" ON matchups FOR SELECT USING (true);

ALTER TABLE format_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public format_matches are viewable by everyone" ON format_matches FOR SELECT USING (true);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public games are viewable by everyone" ON games FOR SELECT USING (true);

ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public weeks are viewable by everyone" ON weeks FOR SELECT USING (true);

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public sponsors are viewable by everyone" ON sponsors FOR SELECT USING (true);

-- SEED DATA 

-- 1. Insert 20 Teams
INSERT INTO teams (name, slug) VALUES 
('The Big Five Rangers', 'the-big-five-rangers'),
('PlayMasters Mavericks', 'playmasters-mavericks'),
('Mahadev Strikers', 'mahadev-strikers'),
('The Big Five', 'the-big-five'),
('Citihub', 'citihub'),
('Amigos Estrella', 'amigos-estrella'),
('Noisy Kings', 'noisy-kings'),
('4 Baggerz', '4-baggerz'),
('4 Baggerz Nation', '4-baggerz-nation'),
('Ndovu Rev Strikers', 'ndovu-rev-strikers'),
('Playmasters', 'playmasters'),
('Amigos Segundo', 'amigos-segundo'),
('Playmasters Warriors', 'playmasters-warriors'),
('Playmasters Rising', 'playmasters-rising'),
('Unbowlivable Strikers', 'unbowlivable-strikers'),
('Unbowlivables', 'unbowlivables'),
('The Who Hurt You Movement', 'the-who-hurt-you-movement'),
('Eastline Stars', 'eastline-stars'),
('The Incredi-Bowls', 'the-incredi-bowls'),
('Amigos Senoras', 'amigos-senoras')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert 13 Sponsors
INSERT INTO sponsors (name) VALUES 
('Alexa Dashcams'), ('Village Bowl'), ('RAA'), ('emami Mentho Plus'), ('WOW Safaris'),
('Parklane Construction'), ('Max Protein (BiteBite)'), ('Tribe'), ('Bondé'), 
('Village Market'), ('King''s Collection'), ('Simba Mbili'), ('Mr. Berry''s')
ON CONFLICT DO NOTHING;

-- 3. Insert Week 1
INSERT INTO weeks (week_number, play_date, day_of_week, venue, status) 
VALUES (1, '2026-04-13', 'Monday', 'Village Bowl', 'scheduled')
ON CONFLICT DO NOTHING;
