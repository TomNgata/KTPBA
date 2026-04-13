import React from 'react';
import { Matchup } from '../types';
import { cn } from '../lib/utils';
import { Calendar, MapPin } from 'lucide-react';

interface MatchCardProps {
  match: Partial<Matchup> & { home_team_name?: string; away_team_name?: string; date?: string; time?: string };
  className?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, className }) => {
  const isLive = match.status === 'live';
  const isDone = match.status === 'done';

  return (
    <div className={cn("bg-white border border-gray-200 overflow-hidden group hover:border-ktpba-red transition-all shadow-sm", className)}>
      <div className="bg-gray-50 px-4 py-2 border-bottom border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <Calendar className="w-3 h-3" />
          {match.date || 'TBD'}
        </div>
        {isLive && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-ktpba-red rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-ktpba-red uppercase tracking-widest">Live</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center font-display font-bold text-gray-400 group-hover:bg-ktpba-red group-hover:text-white transition-colors">
              {match.home_team_name?.[0] || 'H'}
            </div>
            <h4 className="font-display font-bold text-sm uppercase truncate">{match.home_team_name || 'Home Team'}</h4>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">VS</span>
            <div className="h-8 w-[1px] bg-gray-100" />
          </div>

          <div className="flex-1 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center font-display font-bold text-gray-400 group-hover:bg-ktpba-red group-hover:text-white transition-colors">
              {match.away_team_name?.[0] || 'A'}
            </div>
            <h4 className="font-display font-bold text-sm uppercase truncate">{match.away_team_name || 'Away Team'}</h4>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-t border-gray-50 pt-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {match.lane_pair || 'Lanes TBD'}
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div>{match.time || '6:45 PM'}</div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
