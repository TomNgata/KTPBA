
import { useState } from 'react';
import { WEEK_1_MATCHUPS } from '../constants';
import MatchCard from '../components/MatchCard';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Schedule() {
  const [activeWeek, setActiveWeek] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <span className="inline-block px-4 py-1 bg-ktpba-red text-white font-display text-sm font-bold uppercase tracking-[0.3em] mb-6">
            Tournament Roadmap
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            MATCH <span className="text-ktpba-red">SCHEDULE</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-ktpba-black p-2 text-white">
          <button 
            onClick={() => setActiveWeek(Math.max(1, activeWeek - 1))}
            className="p-2 hover:bg-ktpba-red transition-colors disabled:opacity-30"
            disabled={activeWeek === 1}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="px-6 text-center min-w-[120px]">
            <span className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">Active Week</span>
            <span className="font-display text-2xl font-bold">WEEK {activeWeek.toString().padStart(2, '0')}</span>
          </div>
          <button 
            onClick={() => setActiveWeek(Math.min(13, activeWeek + 1))}
            className="p-2 hover:bg-ktpba-red transition-colors disabled:opacity-30"
            disabled={activeWeek === 13}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeWeek === 1 ? (
          WEEK_1_MATCHUPS.map((match, i) => (
            <MatchCard 
              key={i}
              match={{
                home_team_name: match.home,
                away_team_name: match.away,
                lane_pair: match.lanes,
                date: 'Mon 13 Apr',
                status: 'scheduled'
              }}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 border border-dashed border-gray-300">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-gray-400 uppercase tracking-widest">Matchups TBD</h3>
            <p className="text-gray-400 text-sm mt-2">Pairings for Week {activeWeek} will be announced soon.</p>
          </div>
        )}
      </div>

      <div className="mt-20 bg-gray-100 p-10 border-l-8 border-ktpba-green">
        <h3 className="font-display text-2xl font-bold mb-6 uppercase tracking-tight">Venue Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Location</span>
            <p className="text-gray-700 font-bold">Village Bowl, Village Market</p>
            <p className="text-gray-500 text-sm mt-1">Limuru Road, Nairobi</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Match Times</span>
            <p className="text-gray-700 font-bold">Mon, Tue</p>
            <p className="text-gray-500 text-sm mt-1">6:45 PM - 11:00 PM</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Format Sequence</span>
            <p className="text-gray-700 font-bold">Singles → Doubles → Teams</p>
            <p className="text-gray-500 text-sm mt-1">SGL/DBL: Bo3 · TMS: Bo5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
