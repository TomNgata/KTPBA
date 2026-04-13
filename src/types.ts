
export type Format = 'singles' | 'doubles' | 'teams';
export type MatchStatus = 'tbd' | 'scheduled' | 'live' | 'done';

export interface Team {
  id: string;
  name: string;
  slug: string;
  color_hex?: string;
  is_active: boolean;
}

export interface Player {
  id: string;
  team_id: string;
  name: string;
  role: 'captain' | 'member';
  is_active: boolean;
}

export interface Week {
  id: string;
  week_number: number;
  play_date: string;
  day_of_week: string;
  venue: string;
  status: 'scheduled' | 'live' | 'completed';
}

export interface Matchup {
  id: string;
  week_id: string;
  home_team_id: string;
  away_team_id: string;
  lane_pair: string;
  status: MatchStatus;
  summary?: string;
  // Joined data
  home_team?: Team;
  away_team?: Team;
}

export interface FormatMatch {
  id: string;
  matchup_id: string;
  format: Format;
  home_wins: number;
  away_wins: number;
  winner_team_id?: string;
  status: MatchStatus;
}

export interface Game {
  id: string;
  format_match_id: string;
  game_number: number;
  home_score: number;
  away_score: number;
  winner_team_id?: string;
  is_rolloff: boolean;
  entered_at: string;
}

export interface Standing {
  team_id: string;
  name: string;
  slug: string;
  total_points: number;
  singles_pts: number;
  doubles_pts: number;
  teams_pts: number;
  total_pinfall: number;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  tier: 'platinum' | 'gold' | 'silver';
  is_active: boolean;
}
