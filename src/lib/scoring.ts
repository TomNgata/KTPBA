
import { Game, FormatMatch, Format } from '../types';

export function determineGameWinner(homeScore: number, awayScore: number): string | 'rolloff' {
  if (homeScore > awayScore) return 'home';
  if (awayScore > homeScore) return 'away';
  return 'rolloff';
}

export function calculateFormatWinner(games: Game[], format: Format): 'home' | 'away' | null {
  let homeWins = 0;
  let awayWins = 0;

  // Group games by game_number
  const gamesByNumber: Record<number, Game[]> = {};
  games.forEach(g => {
    if (!gamesByNumber[g.game_number]) gamesByNumber[g.game_number] = [];
    gamesByNumber[g.game_number].push(g);
  });

  Object.keys(gamesByNumber).forEach(numStr => {
    const num = parseInt(numStr);
    const gameSet = gamesByNumber[num];
    
    // Find the winner of this game number
    // If there's a roll-off, the roll-off winner wins the game number
    const rolloff = gameSet.find(g => g.is_rolloff);
    const normal = gameSet.find(g => !g.is_rolloff);

    if (rolloff) {
      if (rolloff.home_score > rolloff.away_score) homeWins++;
      else if (rolloff.away_score > rolloff.home_score) awayWins++;
    } else if (normal) {
      if (normal.home_score > normal.away_score) homeWins++;
      else if (normal.away_score > normal.home_score) awayWins++;
    }
  });

  const winsNeeded = format === 'teams' ? 3 : 2;

  if (homeWins >= winsNeeded) return 'home';
  if (awayWins >= winsNeeded) return 'away';
  return null;
}
