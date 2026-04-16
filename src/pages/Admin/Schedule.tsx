
import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { getSupabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

export default function ScheduleAdmin() {
  const [weeks, setWeeks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data: weekData } = await supabase
        .from('weeks')
        .select('*, matchups(*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name))')
        .order('week_number', { ascending: true });
      
      if (weekData) setWeeks(weekData);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Schedule Management</h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs">Matchups & Lane Assignments</p>
        </div>
        
        <button className="px-6 py-3 bg-ktpba-red text-white font-display font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-ktpba-black transition-all">
          <Plus className="w-5 h-5" /> Add Matchup
        </button>
      </div>

      <div className="space-y-12">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-12 h-12 text-ktpba-red animate-spin" />
          </div>
        ) : weeks.length > 0 ? weeks.map((week) => (
          <section key={week.id} className={cn(week.week_number === 1 && "opacity-80")}>
            {week.week_number === 1 && (
              <div className="mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Phase 01: Seeding Round
                </span>
              </div>
            )}
            {week.week_number === 2 && (
              <div className="mb-12 pt-12 border-t-4 border-ktpba-black">
                <span className="px-3 py-1 bg-ktpba-red text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Phase 02: Round Robin
                </span>
                <h2 className="text-3xl font-bold mt-4 tracking-tighter uppercase">Season Matchups</h2>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-tight">Week {week.week_number.toString().padStart(2, '0')}</h2>
              <div className="h-[2px] flex-grow bg-gray-100" />
              <div className="flex items-center gap-3">
                {week.status === 'completed' && (
                   <span className="flex items-center gap-1 text-[10px] font-bold text-ktpba-green uppercase tracking-widest">
                     <CheckCircle2 className="w-3 h-3" /> Played
                   </span>
                )}
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {new Date(week.play_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                    <th className="px-6 py-4">Lanes</th>
                    <th className="px-6 py-4">Home Team</th>
                    <th className="px-6 py-4">Away Team</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {week.matchups && week.matchups.length > 0 ? week.matchups.map((match: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-ktpba-red">{match.lane_pair || 'TBD'}</td>
                      <td className="px-6 py-4 font-bold text-sm uppercase">{match.home_team?.name}</td>
                      <td className="px-6 py-4 font-bold text-sm uppercase">{match.away_team?.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                          match.status === 'done' ? 'bg-ktpba-green/10 text-ktpba-green' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {match.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {week.week_number > 1 ? (
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-ktpba-black transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-2 text-gray-400 hover:text-ktpba-red transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300 uppercase italic">Locked</span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-xs uppercase tracking-widest italic">
                        No matchups scheduled for this week
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )) : (
          <div className="py-24 text-center border-2 border-dashed border-gray-200">
            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-6" />
            <h3 className="font-display text-2xl font-bold uppercase tracking-widest text-gray-400">Marathon Schedule Pending</h3>
            <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">Official week numbers and lane pairings will be published as soon as the league office finalizes the registration.</p>
          </div>
        )}
      </div>
    </div>
  );
}

