import React from 'react';
import { MatchStatus } from '../types';
import { cn } from '../lib/utils';
import { Calendar, MapPin, Activity } from 'lucide-react';

interface TeamSessionCardProps {
  teamName: string;
  lane: string;
  date: string;
  status: MatchStatus;
  totalScore?: number;
  matchPoints?: number | null;
  phase?: 'seeding' | 'regular';
  className?: string;
}

const TeamSessionCard: React.FC<TeamSessionCardProps> = ({ 
  teamName, 
  lane, 
  date, 
  status, 
  totalScore, 
  matchPoints,
  phase = 'regular',
  className 
}) => {
  const isLive = status === 'live';
  const isDone = status === 'done';

  return (
    <div className={cn(
      "bg-white border border-gray-200 overflow-hidden group hover:border-ktpba-red transition-all shadow-sm relative",
      className
    )}>
      {/* Header Info */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <Calendar className="w-3 h-3" />
          {date}
        </div>
        {isLive && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-ktpba-red rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-ktpba-red uppercase tracking-widest">Live</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-ktpba-black text-white rounded-full flex items-center justify-center font-display font-bold text-xs uppercase">
                {teamName[0]}
              </div>
              <span className="text-[10px] font-bold text-ktpba-red uppercase tracking-widest">
                {phase === 'seeding' ? 'Seeding Session' : 'Round Robin'}
              </span>
            </div>
            <h4 className="font-display font-bold text-2xl uppercase tracking-tight group-hover:text-ktpba-red transition-colors">
              {teamName}
            </h4>
          </div>

          {isDone && (
            <div className="flex items-center gap-4">
              {matchPoints !== undefined && matchPoints !== null && (
                <div className="text-right border-r border-gray-100 pr-5 mr-1">
                  <span className="block text-[10px] font-bold text-ktpba-red uppercase tracking-widest mb-1">Match Pts</span>
                  <div className="font-display text-2xl font-black text-ktpba-red">
                    {matchPoints} <span className="text-xs text-gray-400">/ 11</span>
                  </div>
                </div>
              )}
              {totalScore !== undefined && (
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pinfall</span>
                  <div className="bg-ktpba-black text-white px-4 py-2 font-display text-2xl font-bold rounded-sm">
                    {totalScore.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {isLive && (
            <div className="animate-pulse flex items-center gap-2 text-ktpba-red">
              <Activity className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Recording</span>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-t border-gray-50 pt-4 mt-6">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-ktpba-red" />
            Lane {lane}
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div>Village Bowl</div>
        </div>
      </div>
    </div>
  );
};

export default TeamSessionCard;
