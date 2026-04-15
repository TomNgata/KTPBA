import { useState, useEffect } from 'react';
import TeamSessionCard from '../components/TeamSessionCard';
import MatchupCard from '../components/MatchupCard';
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { cn } from '../lib/utils';

type ScheduleTab = 'group-a' | 'group-b' | 'seeding';

export default function Schedule() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeTab, setActiveTab] = useState<ScheduleTab>('seeding');
  const [matchups, setMatchups] = useState<any[]>([]);
  const [teamsInGroup, setTeamsInGroup] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Default to seeding if week 1, otherwise auto-switch to a group if user hasn't
    if (activeWeek === 1) {
      setActiveTab('seeding');
    } else if (activeTab === 'seeding') {
      setActiveTab('group-a');
    }
  }, [activeWeek]);

  useEffect(() => {
    async function fetchSchedule() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data: weeks } = await supabase
        .from('weeks')
        .select('id, play_date')
        .eq('week_number', activeWeek);

      if (weeks && weeks.length > 0) {
        const weekIds = weeks.map(w => w.id);
        const query = supabase
          .from('matchups')
          .select('*, weeks(play_date), home_team:teams!home_team_id(name, group_name), away_team:teams!away_team_id(name, group_name)')
          .in('week_id', weekIds);
        
        // Filter by group if in regular weeks
        if (activeWeek > 1) {
          const group = activeTab === 'group-a' ? 'A' : 'B';
          query.or(`home_team.group_name.eq.${group},away_team.group_name.eq.${group}`);
        }

        const { data: matches } = await query;
        
        if (matches && matches.length > 0) {
          if (activeWeek === 1) {
            // Flatten matchups into individual team sessions for seeding round
            const flattened = matches.reduce((acc: any[], m: any) => {
              const lanes = m.lane_pair ? m.lane_pair.split('-') : [m.lane_pair, '?'];
              const date = m.weeks?.play_date ? new Date(m.weeks.play_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'TBD';
              
              if (m.home_team) {
                acc.push({
                  teamName: m.home_team.name,
                  lane: lanes[0],
                  date: date,
                  status: m.status,
                  id: `${m.id}-home`
                });
              }
              if (m.away_team) {
                acc.push({
                  teamName: m.away_team.name,
                  lane: lanes[1] || '?',
                  date: date,
                  status: m.status,
                  id: `${m.id}-away`
                });
              }
              return acc;
            }, []);
            setMatchups(flattened.sort((a, b) => parseInt(a.lane) - parseInt(b.lane)));
          } else {
            // Display as head-to-head match cards
            const formatted = matches.map(m => ({
              ...m,
              formattedDate: m.weeks?.play_date ? new Date(m.weeks.play_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'TBD'
            }));
            setMatchups(formatted);
          }
        } else {
          setMatchups([]);
          // Fetch the group roster if no matchups for Week 2+
          if (activeWeek > 1) {
            const group = activeTab === 'group-a' ? 'A' : 'B';
            const { data: roster } = await supabase
              .from('teams')
              .select('name')
              .eq('group_name', group)
              .order('name', { ascending: true });
            if (roster) setTeamsInGroup(roster);
          }
        }
      } else {
        setMatchups([]);
        // Fetch group roster even if week isn't in DB yet
        if (activeWeek > 1) {
           const group = activeTab === 'group-a' ? 'A' : 'B';
           const { data: roster } = await supabase
             .from('teams')
             .select('name')
             .eq('group_name', group)
             .order('name', { ascending: true });
           if (roster) setTeamsInGroup(roster);
        }
      }
      setLoading(false);
    }

    fetchSchedule();
  }, [activeWeek, activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <span className="inline-block px-4 py-1 bg-ktpba-red text-white font-display text-sm font-bold uppercase tracking-[0.3em] mb-6">
            Tournament Roadmap
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">
            {activeWeek === 1 ? 'SEEDING' : 'ROUND'} <span className="text-ktpba-red">{activeWeek === 1 ? 'PHASE' : 'ROBIN'}</span>
          </h1>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex bg-gray-100 p-1 rounded-sm w-fit self-end">
            {activeWeek === 1 ? (
              <button className="px-6 py-2 bg-ktpba-black text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                Seeding (Overall)
              </button>
            ) : (
              (['group-a', 'group-b'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                    activeTab === tab ? "bg-ktpba-black text-white shadow-lg" : "text-gray-500 hover:text-ktpba-black"
                  )}
                >
                  {tab === 'group-a' ? 'Monday Division' : 'Tuesday Division'}
                </button>
              ))
            )}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="w-12 h-12 text-ktpba-red animate-spin" />
          </div>
        ) : matchups.length > 0 ? (
          matchups.map((m) => (
            activeWeek === 1 ? (
              <TeamSessionCard 
                key={m.id}
                teamName={m.teamName}
                lane={m.lane}
                date={m.date}
                status={m.status}
              />
            ) : (
              <MatchupCard 
                key={m.id}
                homeTeam={m.home_team.name}
                awayTeam={m.away_team?.name || 'TBD'}
                lane={m.lane_pair}
                date={m.formattedDate}
                status={m.status}
                homePoints={m.home_points} // Note: This would come from session totals if we add that logic
                awayPoints={m.away_points}
              />
            )
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-gray-50 border border-dashed border-gray-300 p-12 text-center mb-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-gray-400 uppercase tracking-widest">Schedule Pending</h3>
              <p className="text-gray-400 text-sm mt-2 font-display uppercase">Week {activeWeek} matchups for {activeTab === 'group-a' ? 'Monday Division' : 'Tuesday Division'} are awaiting selection.</p>
            </div>

            {teamsInGroup.length > 0 && (
              <div className="bg-ktpba-black p-10 text-white">
                <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-ktpba-red mb-8">Division Roster</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {teamsInGroup.map((team, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <span className="text-[10px] font-black text-white/20">#{idx + 1}</span>
                      <span className="font-display font-bold uppercase tracking-tight text-sm border-l-2 border-ktpba-red pl-3">
                        {team.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-20 bg-gray-100 p-10 border-l-8 border-ktpba-green">
        <h3 className="font-display text-2xl font-bold mb-6 uppercase tracking-tight">Phase Lifecycle</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Phase 01</span>
            <p className="text-gray-700 font-bold uppercase">Seeding Round</p>
            <p className="text-gray-500 text-sm mt-1">Individual lane play for maximum pinfall to determine group splitting.</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Phase 02</span>
            <p className="text-gray-700 font-bold uppercase">Round Robin</p>
            <p className="text-gray-500 text-sm mt-1">Head-to-head match points determine the primary league standings.</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Phase 03</span>
            <p className="text-gray-700 font-bold uppercase">Knockout Finals</p>
            <p className="text-gray-500 text-sm mt-1">Combined leaderboard results decides placement in Gold, Silver, and Bronze brackets.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
