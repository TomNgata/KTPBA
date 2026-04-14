import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase';
import { Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Standings() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'overall' | 'singles' | 'doubles' | 'teams'>('overall');

  useEffect(() => {
    async function fetchStandings() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('team_standings')
        .select('*');

      if (error) {
        console.error('Error fetching standings:', error);
      } else if (data) {
        setStandings(data);
      }
      setLoading(false);
    }

    fetchStandings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <span className="inline-block px-4 py-1 bg-ktpba-red text-white font-display text-sm font-bold uppercase tracking-[0.3em] mb-6">
            Leaderboard
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            LEAGUE <span className="text-ktpba-red">STANDINGS</span>
          </h1>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-sm">
          {(['overall', 'singles', 'doubles', 'teams'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                filter === f ? "bg-ktpba-black text-white shadow-lg" : "text-gray-500 hover:text-ktpba-black"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ktpba-black text-white font-display uppercase tracking-widest text-[10px]">
                <th className="px-6 py-4 font-bold">Rank</th>
                <th className="px-6 py-4 font-bold">Team</th>
                <th className="px-6 py-4 font-bold text-center">Singles Pins</th>
                <th className="px-6 py-4 font-bold text-center">Doubles Pins</th>
                <th className="px-6 py-4 font-bold text-center">Teams Pins</th>
                <th className="px-6 py-4 font-bold text-right bg-ktpba-red">Total Pinfall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {standings.map((team, i) => (
                <tr key={team.team_id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-8 h-8 flex items-center justify-center font-display font-bold text-sm",
                        i === 0 ? "bg-ktpba-red text-white" : "bg-gray-100 text-gray-500"
                      )}>
                        {i + 1}
                      </span>
                      {i < 3 && <Trophy className={cn("w-4 h-4", i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : "text-amber-600")} />}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-display font-bold text-lg uppercase tracking-tight group-hover:text-ktpba-red transition-colors">
                      {team.name}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center font-mono text-sm text-gray-500">{team.singles_pinfall.toLocaleString()}</td>
                  <td className="px-6 py-5 text-center font-mono text-sm text-gray-500">{team.doubles_pinfall.toLocaleString()}</td>
                  <td className="px-6 py-5 text-center font-mono text-sm text-gray-500">{team.teams_pinfall.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right font-display font-bold text-xl bg-ktpba-red/5 text-ktpba-red">
                    {team.total_pinfall.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-ktpba-black p-8 text-white">
          <h3 className="font-display text-xl font-bold mb-4 uppercase tracking-wider text-ktpba-red">Marathon Rules</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-ktpba-red rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">1</div>
              <span>Ranking is determined strictly by <strong>Total Pinfall</strong> across all formats.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-ktpba-red rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">2</div>
              <span>Singles/Doubles consist of 3 games each. Teams format consists of 5 Baker-style games.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-ktpba-red rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">3</div>
              <span>All scores are cumulative. High total pinfall at the end of the marathon wins.</span>
            </li>
          </ul>
        </div>
        <div className="bg-white border border-gray-200 p-8">
          <h3 className="font-display text-xl font-bold mb-4 uppercase tracking-wider">Tie-Breakers</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            In the event of a tie in total pinfall, the following criteria apply in order:
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-sm">
              <span className="text-xs font-bold uppercase tracking-widest">1. Highest Single Session Total</span>
              <ArrowUp className="w-4 h-4 text-ktpba-green" />
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-sm">
              <span className="text-xs font-bold uppercase tracking-widest">2. Single Game High Team Score</span>
              <Minus className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    </div>
  );
}
