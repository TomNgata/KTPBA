
import TeamSessionCard from '../components/TeamSessionCard';
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getSupabase } from '../lib/supabase';

export default function Schedule() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data: week } = await supabase
        .from('weeks')
        .select('id, play_date')
        .eq('week_number', activeWeek)
        .single();

      if (week) {
        const { data: matches } = await supabase
          .from('matchups')
          .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
          .eq('week_id', week.id);
        
        if (matches) {
          // Flatten matchups into individual team sessions
          const flattened = matches.reduce((acc: any[], m: any) => {
            const lanes = m.lane_pair ? m.lane_pair.split('-') : ['?', '?'];
            acc.push({
              teamName: m.home_team.name,
              lane: lanes[0],
              date: new Date(week.play_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
              status: m.status,
              id: `${m.id}-home`
            });
            acc.push({
              teamName: m.away_team.name,
              lane: lanes[1],
              date: new Date(week.play_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
              status: m.status,
              id: `${m.id}-away`
            });
            return acc;
          }, []);
          setSessions(flattened.sort((a, b) => parseInt(a.lane) - parseInt(b.lane)));
        } else {
          setSessions([]);
        }
      } else {
        setSessions([]);
      }
      setLoading(false);
    }

    fetchSessions();
  }, [activeWeek]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <span className="inline-block px-4 py-1 bg-ktpba-red text-white font-display text-sm font-bold uppercase tracking-[0.3em] mb-6">
            Session Roadmap
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">
            TEAMS <span className="text-ktpba-red">PLAYING</span>
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
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="w-12 h-12 text-ktpba-red animate-spin" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <TeamSessionCard 
              key={session.id}
              teamName={session.teamName}
              lane={session.lane}
              date={session.date}
              status={session.status}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 border border-dashed border-gray-300">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-gray-400 uppercase tracking-widest">Sessions TBD</h3>
            <p className="text-gray-400 text-sm mt-2">Team assignments for Week {activeWeek} will be announced soon.</p>
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
