import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { Trophy, ArrowUp, Minus, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

type StandingsTab = 'overall' | 'group-a' | 'group-b';

export default function Standings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const initialTab = (searchParams.get('tab') as StandingsTab) || 'overall';
  const [activeTab, setActiveTab] = useState<StandingsTab>(initialTab);

  useEffect(() => {
    // Sync tab with URL if it changes externally
    const tabParam = searchParams.get('tab') as StandingsTab;
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: StandingsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
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

  const filteredStandings = standings
    .filter(team => {
      if (activeTab === 'group-a') return team.group_name === 'A';
      if (activeTab === 'group-b') return team.group_name === 'B';
      return true;
    })
    .sort((a, b) => {
      if (activeTab === 'overall') {
        return b.seeding_pinfall - a.seeding_pinfall;
      }
      // Group Stage: Match Points first, then Pinfall
      if (b.match_points !== a.match_points) {
        return b.match_points - a.match_points;
      }
      return b.total_pinfall - a.total_pinfall;
    });

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
        
        <div className="flex bg-gray-100 p-1 rounded-sm overflow-x-auto">
          {(['overall', 'group-a', 'group-b'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "px-6 py-2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all",
                activeTab === tab ? "bg-ktpba-black text-white shadow-lg" : "text-gray-500 hover:text-ktpba-black"
              )}
            >
              {tab === 'overall' ? 'Seeding Phase' : tab === 'group-a' ? 'Monday Division' : 'Tuesday Division'}
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
                <th className="px-6 py-4 font-bold text-center">Group</th>
                <th className="px-6 py-4 font-bold">Team</th>
                <th className="px-6 py-4 font-bold text-center bg-ktpba-red/50">Match Points</th>
                <th className="px-6 py-4 font-bold text-center">Penalty</th>
                <th className="px-6 py-4 font-bold text-right bg-ktpba-red">Total Pinfall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStandings.map((team, i) => (
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
                  <td className="px-6 py-5 text-center">
                    <span className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full",
                      team.group_name === 'A' ? "bg-blue-50 text-blue-600" : 
                      team.group_name === 'B' ? "bg-purple-50 text-purple-600" : 
                      "bg-gray-50 text-gray-400"
                    )}>
                      {team.group_name ? `Group ${team.group_name}` : 'TBD'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-display font-bold text-lg uppercase tracking-tight group-hover:text-ktpba-red transition-colors">
                      {team.name}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center bg-gray-50/50">
                    <span className="font-display text-2xl font-bold">
                      {team.match_points}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {team.penalty_points > 0 ? (
                      <div className="flex items-center justify-center gap-2 text-ktpba-red font-bold animate-pulse">
                        <ShieldAlert className="w-4 h-4" />
                        <span>-{team.penalty_points}</span>
                      </div>
                    ) : (
                      <span className="text-gray-200">0</span>
                    )}
                  </td>
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
          <h3 className="font-display text-xl font-bold mb-4 uppercase tracking-wider text-ktpba-red">Points System</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-ktpba-red rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">1</div>
              <span><strong>11 Match Points</strong> available per session. Every game won in Singles, Doubles, and Teams counts as <strong>1 point</strong> on the leaderboard.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-ktpba-red rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">2</div>
              <span>Ranking is determined strictly by <strong>Match Points</strong>. Total Pinfall is used only as a secondary tie-breaker.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-ktpba-red rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">3</div>
              <span>The top 8 teams from each division will qualify for the <strong>Gold Bracket</strong>, middle 8 for <strong>Silver</strong>, and final 4 for **Bronze** following specific rank criteria.</span>
            </li>
          </ul>
        </div>
        <div className="bg-white border border-gray-200 p-8">
          <h3 className="font-display text-xl font-bold mb-4 uppercase tracking-wider">Tournament Structure</h3>
          <div className="space-y-4 text-xs text-gray-500 uppercase tracking-widest font-bold">
            <div className="p-4 bg-gray-50 border-l-4 border-ktpba-red">
              <span className="block text-gray-400 mb-1">Phase 01</span>
              Seeding Round (Total Pinfall)
            </div>
            <div className="p-4 bg-gray-50 border-l-4 border-ktpba-green">
              <span className="block text-gray-400 mb-1">Phase 02</span>
              Group Round Robin (Match Points)
            </div>
            <div className="p-4 bg-gray-50 border-l-4 border-ktpba-black">
              <span className="block text-gray-400 mb-1">Phase 03</span>
              Knockouts (Gold, Silver, Bronze)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
