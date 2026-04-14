
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Calendar, Users, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SPONSORS, TEAMS, WEEK_1_MATCHUPS } from '../constants';
import { getSupabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function Home() {
  const [stats, setStats] = useState({
    teams: 20,
    weeks: 13,
    points: 0
  });
  const [nextMatchday, setNextMatchday] = useState<any>(null);
  const [matchups, setMatchups] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabase();
      if (!supabase) return;

      // Fetch points total
      const { data: standings } = await supabase.from('team_standings').select('total_points');
      if (standings) {
        const total = standings.reduce((acc, curr) => acc + (curr.total_points || 0), 0);
        setStats(prev => ({ ...prev, points: total }));
      }

      // Fetch next matchup
      const { data: week } = await supabase
        .from('weeks')
        .select('*')
        .eq('status', 'scheduled')
        .order('play_date', { ascending: true })
        .limit(1)
        .single();
      
      if (week) {
        setNextMatchday(week);
        const { data: matches } = await supabase
          .from('matchups')
          .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
          .eq('week_id', week.id)
          .limit(3);
        if (matches) setMatchups(matches);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-ktpba-black text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop" 
            alt="Bowling Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ktpba-black via-ktpba-black/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-ktpba-red text-white font-display text-sm font-bold uppercase tracking-[0.3em] mb-6">
              Official Tournament App
            </span>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-none tracking-tighter">
              KTPBA TEAMS<br />
              <span className="text-ktpba-red">MARATHON 2026</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              20 Teams. 13 Weeks. One Champion. The ultimate bowling showdown at Village Bowl has arrived.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/standings" className="px-8 py-4 bg-white text-ktpba-black font-display font-bold uppercase tracking-wider hover:bg-ktpba-red hover:text-white transition-all flex items-center gap-2">
                View Standings <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/schedule" className="px-8 py-4 border border-white/30 text-white font-display font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                Full Schedule
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2 bg-ktpba-red" />
      </section>

      {/* Stats / Quick Info */}
      <section className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-20">
        {[
          { label: 'Competing Teams', value: stats.teams, icon: Users, color: 'bg-ktpba-black' },
          { label: 'Match Weeks', value: stats.weeks, icon: Calendar, color: 'bg-ktpba-red' },
          { label: 'Tournament Points', value: stats.points > 0 ? stats.points : '1,500+', icon: Trophy, color: 'bg-ktpba-green' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={cn(
              "p-8 text-white shadow-2xl flex flex-col items-center text-center group hover:-translate-y-2 transition-transform",
              stat.color
            )}
          >
            <stat.icon className="w-10 h-10 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="text-4xl font-display font-bold mb-1">{stat.value}</span>
            <span className="text-xs uppercase tracking-widest opacity-60 font-bold">{stat.label}</span>
          </motion.div>
        ))}
      </section>

      {/* Next Match */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex items-end justify-between mb-10 border-b-2 border-ktpba-black pb-4">
          <div>
            <h2 className="text-4xl font-bold uppercase tracking-tight">Next Matchday</h2>
            <p className="text-gray-500 uppercase tracking-widest text-sm mt-1">
              {nextMatchday 
                ? `${new Date(nextMatchday.play_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${nextMatchday.venue}` 
                : 'Monday 13 April 2026 · Village Bowl'}
            </p>
          </div>
          <Link to="/schedule" className="text-ktpba-red font-display font-bold uppercase text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Full Schedule <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(matchups.length > 0 ? matchups : WEEK_1_MATCHUPS.slice(0, 3)).map((match, i) => (
            <div key={i} className="bg-white border border-gray-200 p-6 flex flex-col gap-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Lane {match.lane_pair || match.lanes}</span>
                <span className="text-ktpba-red">6:45 PM</span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold truncate max-w-[150px]">
                    {match.home_team?.name || match.home}
                  </span>
                  <span className="text-xs font-bold text-gray-300">HOME</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-grow bg-gray-100" />
                  <span className="text-[10px] font-bold text-gray-400">VS</span>
                  <div className="h-[1px] flex-grow bg-gray-100" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold truncate max-w-[150px]">
                    {match.away_team?.name || match.away}
                  </span>
                  <span className="text-xs font-bold text-gray-300">AWAY</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsors Ticker */}
      <section className="bg-gray-100 py-16 overflow-hidden border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.4em] text-gray-400">Our Official Partners</h3>
        </div>
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...SPONSORS, ...SPONSORS].map((sponsor, i) => (
            <div key={i} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100 cursor-default">
              <Star className="w-4 h-4 text-ktpba-red" />
              <span className="font-display text-2xl font-bold text-ktpba-black uppercase tracking-tighter">{sponsor}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

