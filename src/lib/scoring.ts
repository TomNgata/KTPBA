
import { Game, FormatMatch, Format } from '../types';

/**
 * Scoring logic for KTPBA Teams Marathon.
 * The system now focuses strictly on Pinfall.
 * Head-to-head winner logic is deprecated for the main leaderboard.
 */

export function determineGameWinner(homeScore: number, awayScore: number): string | 'rolloff' {
  if (homeScore > awayScore) return 'home';
  if (awayScore > homeScore) return 'away';
  return 'rolloff';
}

// NOTE: calculateFormatWinner is deprecated as results are now pinfall-cumulative.
export function calculateFormatWinner(games: any[], format: any): null {
  return null;
}
