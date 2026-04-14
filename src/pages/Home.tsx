
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Calendar, Users, ArrowRight, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import Logo from '../components/Logo';

export default function Home() {
  const [stats, setStats] = useState({
    teams: 0,
    weeks: 13,
    points: 0
  });
  const [nextMatchday, setNextMatchday] = useState<any>(null);
  const [matchups, setMatchups] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabase();
      if (!supabase) return;

      setLoading(true);

      // Fetch team count
      const { count: teamCount } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      // Fetch total pinfall
      const { data: standings } = await supabase.from('team_standings').select('total_pinfall');
      const totalPinfall = standings?.reduce((acc, curr) => acc + (curr.total_pinfall || 0), 0) || 0;

      setStats({
        teams: teamCount || 0,
        weeks: 13,
        points: totalPinfall
      });

      // Fetch active sponsors
      const { data: sponsorData } = await supabase
        .from('sponsors')
        .select('name')
        .eq('is_active', true);
      if (sponsorData) setSponsors(sponsorData);

      // Fetch next week's matchups
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
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-32 pb-32 bg-ktpba-white selection:bg-ktpba-red/30">
      {/* Hero Section - Static First Premium Load */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-ktpba-black text-white">
        <div className="absolute inset-0">
          <img 
            src="/images/hero-bowling.png" 
            alt="Bespoke KTPBA Bowling Arena" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ktpba-black/80 via-transparent to-ktpba-black" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div> {/* No wrapper animation for main text per guide */}
            <span className="inline-block px-4 py-1.5 bg-ktpba-red text-white font-display text-xs font-bold uppercase tracking-[0.4em] mb-8">
              The 2026 Kenyan Season
            </span>
            <h1 className="text-6xl md:text-9xl font-bold mb-8 leading-none tracking-tighter">
              KTPBA TEAMS<br />
              <span className="text-ktpba-red outline-text">MARATHON</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto mb-12 leading-relaxed">
              Where Nairobi's elite bowlers collide. 13 weeks of precision, strategy, and total pinfall dominance at Village Bowl.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/standings" className="min-h-[48px] px-10 py-4 bg-ktpba-red text-white font-display font-bold uppercase tracking-widest hover:bg-white hover:text-ktpba-black transition-all duration-300 flex items-center gap-3">
                Live Standings <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/schedule" className="min-h-[48px] px-10 py-4 border-2 border-white/20 text-white font-display font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300">
                View Schedule
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-4 bg-ktpba-red" />
      </section>

      {/* Stats - Fade In Up Only */}
      <section className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-3 gap-0 -mt-40 relative z-20 shadow-2xl">
        {[
          { label: 'Competing Teams', value: stats.teams || '--', icon: Users, color: 'bg-ktpba-black' },
          { label: 'Match Weeks', value: stats.weeks, icon: Calendar, color: 'bg-ktpba-red' },
          { label: 'Total Pinfall', value: stats.points > 0 ? stats.points.toLocaleString() : '--', icon: Trophy, color: 'bg-ktpba-green' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={cn(
              "p-12 text-white flex flex-col items-center text-center group transition-all duration-500",
              stat.color
            )}
          >
            <stat.icon className="w-12 h-12 mb-6 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-5xl font-display font-bold mb-2 tabular-nums">{stat.value}</span>
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-60 font-black">{stat.label}</span>
          </motion.div>
        ))}
      </section>

      {/* Next Matchday */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-baseline justify-between mb-12 border-b-4 border-ktpba-black pb-6 gap-4"
        >
          <div>
            <h2 className="text-5xl font-bold uppercase tracking-tighter">Next Matchday</h2>
            <p className="text-gray-500 uppercase tracking-[.25em] text-xs font-bold mt-2">
              {nextMatchday 
                ? `${new Date(nextMatchday.play_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${nextMatchday.venue}` 
                : 'Monday 13 April 2026 · Village Bowl'}
            </p>
          </div>
          <Link to="/schedule" className="min-h-[44px] text-ktpba-red font-display font-bold uppercase text-sm flex items-center gap-2 hover:gap-4 transition-all group">
            Full Schedule <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-10 h-10 text-ktpba-red animate-spin" /></div>
          ) : matchups.length > 0 ? (
            matchups.map((match, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border-l-8 border-ktpba-red p-8 flex flex-col gap-8 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <span>Lane Pair {match.lane_pair || match.lanes || 'TBD'}</span>
                  <span className="text-ktpba-red bg-ktpba-red/5 px-2 py-1">6:45 PM Start</span>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between group/team">
                    <span className="font-display text-2xl font-bold truncate max-w-[200px] group-hover/team:text-ktpba-red transition-colors">
                      {match.home_team?.name}
                    </span>
                    <span className="text-[10px] font-black text-gray-200">HOME</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="h-[2px] flex-grow bg-gray-50" />
                    <span className="text-[10px] font-black text-gray-300 italic">VS</span>
                    <div className="h-[2px] flex-grow bg-gray-50" />
                  </div>
                  <div className="flex items-center justify-between group/team">
                    <span className="font-display text-2xl font-bold truncate max-w-[200px] group-hover/team:text-ktpba-red transition-colors">
                      {match.away_team?.name}
                    </span>
                    <span className="text-[10px] font-black text-gray-200">AWAY</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-white border border-dashed border-gray-200">
               <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-6" />
               <h3 className="font-display text-2xl font-bold uppercase tracking-widest text-gray-400">Matchups Releasing Soon</h3>
               <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">The lane assignments and upcoming pairings for Week 01 will be published here once the season officially begins.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA 1 — Results Deep Dive */}
      <section className="bg-ktpba-black text-white relative overflow-hidden group">
        <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-6">Analyze the <span className="text-ktpba-red">Performance</span></h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
              Don't just watch the scoreboard. Dive deep into player averages, high games, and session archives. Every pin tells a story.
            </p>
            <Link to="/results" className="min-h-[44px] inline-flex items-center gap-4 text-ktpba-red font-display font-bold uppercase tracking-widest hover:text-white transition-colors group">
              Browse Game Data <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
             <Logo size={200} className="opacity-10 group-hover:opacity-20 transition-opacity duration-1000 rotate-12" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-ktpba-red/5 to-transparent" />
      </section>

      {/* CTA 2 — Sponsors */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="bg-ktpba-white border-2 border-ktpba-black p-12 md:p-20 flex flex-col items-center text-center">
           <Star className="w-12 h-12 text-ktpba-red mb-8 animate-pulse" />
           <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8 max-w-2xl">Support the Future of Kenyan Bowling</h2>
           <p className="text-gray-500 text-lg mb-12 max-w-xl font-light">
             Partner with the KTPBA Teams Marathon and put your brand in front of Nairobi's most engaged sporting community.
           </p>
           <Link to="/sponsors" className="min-h-[48px] px-12 py-5 bg-ktpba-black text-white font-display font-bold uppercase tracking-widest hover:bg-ktpba-red transition-all duration-300">
             Partner with us
           </Link>
        </div>
      </section>

      {/* Sponsors Ticker */}
      {sponsors.length > 0 && (
        <section className="bg-gray-50 py-20 overflow-hidden border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
            <h3 className="font-display text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Our Official Tournament Partners</h3>
          </div>
          <div className="flex gap-20 animate-marquee whitespace-nowrap">
            {[...sponsors, ...sponsors].map((sponsor, i) => (
              <div key={i} className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100 cursor-default">
                <Star className="w-4 h-4 text-ktpba-red" />
                <span className="font-display text-3xl font-bold text-ktpba-black uppercase tracking-tighter">{sponsor.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA — Standings */}
      <section className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-20">
         <div>
            <h2 className="text-5xl font-bold uppercase tracking-tighter mb-6">The Road to <span className="text-ktpba-red">Championship</span></h2>
            <p className="text-gray-600 text-lg mb-10 font-light">
              Track your team's rank in real-time. The marathon is long, but every game counts towards the seasonal pinfall crown.
            </p>
            <Link to="/standings" className="min-h-[44px] inline-flex items-center gap-4 text-ktpba-red font-display font-bold uppercase tracking-widest hover:pl-2 transition-all group">
              View Final Standings <ArrowRight className="w-5 h-5" />
            </Link>
         </div>
         <div className="aspect-video bg-ktpba-black overflow-hidden relative group">
            <img 
              src="/images/hero-bowling.png" 
              className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2000ms]" 
              alt="Bowling Tournament"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <Trophy className="w-20 h-20 text-white/20 group-hover:text-ktpba-red/80 transition-colors" />
            </div>
         </div>
      </section>
    </div>
  );
}

