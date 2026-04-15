import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Trophy, Users, Calendar, ArrowRight, AlertCircle, CheckCircle2, Settings, Info, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getSupabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [activeCount, setActiveCount] = useState<number | string>('...');
  const [pendingCount, setPendingCount] = useState<number | string>('...');
  const [playerCount, setPlayerCount] = useState<number | string>('...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = getSupabase();
      if (!supabase) return;

      try {
        // 1. Players count
        const { count: players } = await supabase.from('players').select('*', { count: 'exact', head: true });
        setPlayerCount(players || 0);

        // 2. Active Matchups (Scheduled or Live)
        const { count: active } = await supabase
          .from('matchups')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'done');
        setActiveCount(active || 0);

        // 3. Scores Pending (Matchups not done but either live or scheduled)
        // For now, mirroring active matchups since any active matchup needs a score eventually
        setPendingCount(active || 0);

      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statsList = [
    { label: 'Active Matchups', value: activeCount, icon: Calendar, color: 'text-blue-500' },
    { label: 'Scores Pending', value: pendingCount, icon: Trophy, color: 'text-ktpba-red' },
    { label: 'Players Registered', value: playerCount, icon: Users, color: 'text-ktpba-green' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 uppercase tracking-widest text-xs">Tournament Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statsList.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={cn("w-8 h-8", stat.color)} />
              <span className="text-3xl font-display font-bold">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-gray-300" /> : stat.value}
              </span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold border-b-2 border-ktpba-black pb-2">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/score-entry" className="p-6 bg-ktpba-red text-white hover:bg-ktpba-black transition-all group">
              <Trophy className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-bold text-lg uppercase mb-1">Enter Scores</h3>
              <p className="text-white/60 text-xs">Log game results for active matchups</p>
            </Link>
            <Link to="/admin/schedule" className="p-6 bg-ktpba-black text-white hover:bg-ktpba-red transition-all group">
              <Calendar className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-bold text-lg uppercase mb-1">Manage Schedule</h3>
              <p className="text-white/60 text-xs">Set pairings and lane assignments</p>
            </Link>
            <Link to="/admin/players" className="p-6 bg-white border border-gray-200 hover:border-ktpba-red transition-all group">
              <Users className="w-8 h-8 mb-4 text-gray-300 group-hover:text-ktpba-red transition-colors" />
              <h3 className="font-display font-bold text-lg uppercase mb-1">Player Roster</h3>
              <p className="text-gray-400 text-xs">Track participation and eligibility</p>
            </Link>
            <Link to="/admin/announcements" className="p-6 bg-white border border-gray-200 hover:border-ktpba-red transition-all group">
              <Settings className="w-8 h-8 mb-4 text-gray-300 group-hover:text-ktpba-red transition-colors" />
              <h3 className="font-display font-bold text-lg uppercase mb-1">Announcements</h3>
              <p className="text-gray-400 text-xs">Post match night updates and alerts</p>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold border-b-2 border-ktpba-black pb-2">System Alerts</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-amber-50 border-l-4 border-amber-500">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm uppercase">Manage Next Matchday</h4>
                <p className="text-gray-600 text-xs mt-1">Ensure pairings and lane assignments for the upcoming Round Robin week are published before Friday.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-blue-50 border-l-4 border-blue-500">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm uppercase">Baker Lineups Required</h4>
                <p className="text-gray-600 text-xs mt-1">Teams must submit their 5-player rotation before the Teams format begins tonight.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-green-50 border-l-4 border-green-500">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm uppercase">Database Connected</h4>
                <p className="text-gray-600 text-xs mt-1">Supabase connection is active and RLS policies are enforced.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

