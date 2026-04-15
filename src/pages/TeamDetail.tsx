
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Users, Calendar, ArrowLeft, Info, Loader2, Gauge } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import EmptyState from '../components/EmptyState';
import { cn } from '../lib/utils';
import TeamSessionCard from '../components/TeamSessionCard';

export default function TeamDetail() {
  const { slug } = useParams();
  const [team, setTeam] = useState<any>(null);
  const [standings, setStandings] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamData() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // Fetch team basic info
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (teamData) {
        setTeam(teamData);
        
        // Fetch specific standings for this team
        const { data: standingData } = await supabase
          .from('team_standings')
          .select('*')
          .eq('team_id', teamData.id)
          .single();
        
        if (standingData) setStandings(standingData);

        // Fetch match history
        const { data: matches } = await supabase
          .from('matchups')
          .select(`
            id, 
            status, 
            type,
            lane_pair,
            weeks(play_date, week_number),
            home_team:teams!home_team_id(name), 
            away_team:teams!away_team_id(name),
            format_matches(
              id,
              format,
              games(home_score, away_score)
            )
          `)
          .or(`home_team_id.eq.${teamData.id},away_team_id.eq.${teamData.id}`)
          .eq('status', 'done')
          .order('id', { ascending: false });

        if (matches) {
          const sessions = matches.map((m: any) => {
            const isHome = m.home_team.name === teamData.name;
            const lanes = m.lane_pair ? m.lane_pair.split('-') : ['?', '?'];
            
            let totalPins = 0;
            let points = 0;
            m.format_matches?.forEach((fm: any) => {
              fm.games?.forEach((g: any) => {
                totalPins += isHome ? (g.home_score || 0) : (g.away_score || 0);
                
                if (m.type === 'regular') {
                  if (isHome && g.home_score > g.away_score) points++;
                  else if (!isHome && g.away_score > g.home_score) points++;
                }
              });
            });

            const isSeeding = m.type === 'seeding';

            return {
              id: m.id,
              weekNumber: m.weeks.week_number,
              date: new Date(m.weeks.play_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
              lane: isHome ? lanes[0] : lanes[1],
              totalScore: totalPins,
              matchPoints: isSeeding ? null : points,
              phase: m.type,
              status: m.status
            };
          });
          setHistory(sessions);
        }
      }
      
      setLoading(false);
    }
    fetchTeamData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-ktpba-red animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <EmptyState 
          icon={Users}
          title="Team Not Found"
          description="The team profile you are looking for does not exist or has been modified. Please return to the team directory to find the latest contenders."
          actionLabel="View All Teams"
          actionLink="/teams"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <Link to="/teams" className="inline-flex items-center gap-2 text-gray-400 hover:text-ktpba-red transition-colors font-display text-xs font-bold uppercase tracking-widest mb-10">
        <ArrowLeft className="w-4 h-4" /> Back to Teams
      </Link>

      <div className="bg-ktpba-black text-white p-12 relative overflow-hidden mb-12">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-ktpba-red flex items-center justify-center rounded-sm">
                <Users className="text-white w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Team Profile</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">{team.name}</h1>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center group">
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Rank</span>
              <span className="font-display text-3xl font-bold flex items-center justify-center gap-2">
                <span className="text-ktpba-red">#</span>
                {standings?.rank || '--'}
              </span>
            </div>
            <div className="text-center group">
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Match Points</span>
              <span className="font-display text-3xl font-bold text-ktpba-red">
                {standings?.match_points || '0'}
              </span>
            </div>
            <div className="text-center group font-display hidden md:block">
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Total Pinfall</span>
              <span className="text-3xl font-bold">{standings?.total_pinfall?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-ktpba-red/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="kenyan-stripe absolute bottom-0 left-0 right-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-8 border-b-2 border-ktpba-black pb-2 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-ktpba-red" />
              Session History
            </h2>
            {history.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map(session => (
                  <TeamSessionCard 
                    key={session.id}
                    teamName={team.name}
                    lane={session.lane}
                    date={`Week ${session.weekNumber} · ${session.date}`}
                    status={session.status}
                    totalScore={session.totalScore}
                    matchPoints={session.matchPoints}
                    phase={session.phase}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 p-12 text-center">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No match records found</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 border-b-2 border-ktpba-black pb-2">Format Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Singles Pins', value: standings?.singles_pinfall?.toLocaleString() || '0' },
                { label: 'Doubles Pins', value: standings?.doubles_pinfall?.toLocaleString() || '0' },
                { label: 'Teams Pins', value: standings?.teams_pinfall?.toLocaleString() || '0' },
              ].map(stat => (
                <div key={stat.label} className="bg-white border border-gray-200 p-6">
                  <h4 className="font-display font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">{stat.label}</h4>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-display font-bold">{stat.value}</span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1 font-mono">PINS</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-gray-200 p-8">
            <div className="flex items-center gap-2 text-ktpba-red mb-4">
              <Info className="w-5 h-5" />
              <h3 className="font-display font-bold uppercase tracking-wider">Privacy Notice</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              In accordance with KTPBA tournament rules, individual player identities and game-by-game lineups are not displayed on public team profiles. 
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mt-4">
              Only aggregate team performance and standings points are visible to the public.
            </p>
          </div>

          <div className="bg-gray-100 p-8 border-l-8 border-ktpba-red">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold uppercase tracking-wider">Group Assignment</h3>
                <span className={cn(
                  "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full",
                  team.group_name === 'A' ? "bg-blue-100 text-blue-600" : 
                  team.group_name === 'B' ? "bg-purple-100 text-purple-600" : 
                  "bg-white text-gray-400 shadow-sm"
                )}>
                  {team.group_name ? `Group ${team.group_name}` : 'TBD'}
                </span>
             </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Play Day</span>
                <span>{team.group_name === 'A' ? 'MONDAY' : team.group_name === 'B' ? 'TUESDAY' : 'TBD'}</span>
              </div>
              <div className="font-display font-bold text-lg uppercase">
                {team.group_name === 'A' ? 'Monday Night Marathon' : team.group_name === 'B' ? 'Tuesday Night Marathon' : 'Pending Allocation'}
              </div>
              <div className="text-xs text-gray-500 italic">Division determined by Week 1 Seeding Phase performance results.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

