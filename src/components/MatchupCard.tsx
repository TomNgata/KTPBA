import React from 'react';
import { cn } from '../lib/utils';
import { Calendar, Info } from 'lucide-react';

interface MatchupCardProps {
  homeTeam: string;
  awayTeam: string;
  lane: string;
  date: string;
  status: string;
  homePoints?: number;
  awayPoints?: number;
  homeChoice?: boolean;
}

const MatchupCard: React.FC<MatchupCardProps> = ({ 
  homeTeam, 
  awayTeam, 
  lane, 
  date, 
  status,
  homePoints,
  awayPoints,
  homeChoice = true
}) => {
  const isLive = status === 'live';
  const isDone = status === 'done';

  return (
    <div className="bg-white border border-gray-200 overflow-hidden relative group hover:border-ktpba-red transition-all shadow-sm">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          {date}
        </div>
        <div>
          {status}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <div className="relative mb-3">
              <div className="w-12 h-12 bg-ktpba-black text-white rounded-full flex items-center justify-center font-display font-bold text-xl mx-auto shadow-md">
                {homeTeam[0]}
              </div>
              {homeChoice && (
                <div className="absolute -top-1 -right-1 bg-ktpba-red text-white p-1 rounded-full shadow-lg" title="Home Decision Power">
                  <Info className="w-3 h-3" />
                </div>
              )}
            </div>
            <h4 className="font-display font-bold text-lg uppercase tracking-tight block min-h-[3rem] line-clamp-2">
              {homeTeam}
            </h4>
            {isDone && (
              <div className="mt-2 text-2xl font-bold font-display">{homePoints}</div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-gray-300 italic">VS</span>
            <div className="px-3 py-1 bg-gray-100 text-[8px] font-bold uppercase tracking-widest text-gray-400 rounded-full">
              Lane {lane}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <div className="mb-3">
              <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-display font-bold text-xl mx-auto border border-gray-200">
                {awayTeam[0]}
              </div>
            </div>
            <h4 className="font-display font-bold text-lg uppercase tracking-tight block min-h-[3rem] line-clamp-2">
              {awayTeam}
            </h4>
            {isDone && (
              <div className="mt-2 text-2xl font-bold font-display">{awayPoints}</div>
            )}
          </div>
        </div>

        {homeChoice && !isDone && !isLive && (
          <div className="mt-6 pt-4 border-t border-gray-50 text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Schedule Pending Decision by <span className="text-ktpba-red">{homeTeam}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchupCard;
