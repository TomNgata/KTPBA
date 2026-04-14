
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Users, Calendar, ArrowLeft, Info, Loader2 } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import EmptyState from '../components/EmptyState';

export default function TeamDetail() {
  const { slug } = useParams();
  const [team, setTeam] = useState<any>(null);
  const [standings, setStandings] = useState<any>(null);
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
            <div className="text-center">
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Rank</span>
              <span className="font-display text-3xl font-bold">--</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Total Pinfall</span>
              <span className="font-display text-3xl font-bold">{standings?.total_pinfall?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-ktpba-red/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="kenyan-stripe absolute bottom-0 left-0 right-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-8 border-b-2 border-ktpba-black pb-2">Match History</h2>
            <div className="bg-gray-50 border border-dashed border-gray-300 p-12 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No matches recorded yet</p>
            </div>
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

          <div className="bg-gray-100 p-8">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold uppercase tracking-wider">Upcoming Match</h3>
                <span className="px-2 py-1 bg-ktpba-red text-white text-[10px] font-bold animate-pulse">LIVE SOON</span>
             </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Phase I</span>
                <span>Apr 2026</span>
              </div>
              <div className="font-display font-bold text-lg uppercase">Schedule TBD</div>
              <div className="text-xs text-gray-500 italic">Review current standings for the latest performance rankings.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

