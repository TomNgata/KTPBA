
import TeamSessionCard from '../components/TeamSessionCard';

export default function Results() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      const supabase = getSupabase();
      if (!supabase) return;

      setLoading(true);
      // Fetch matchups with games and team names
      const { data } = await supabase
        .from('matchups')
        .select(`
          id, 
          status, 
          lane_pair,
          weeks(play_date),
          home_team:teams!home_team_id(name), 
          away_team:teams!away_team_id(name),
          format_matches(
            games(home_score, away_score)
          )
        `)
        .eq('status', 'done')
        .order('id', { ascending: false });
      
      if (data) {
        const flattened = data.reduce((acc: any[], m: any) => {
          const lanes = m.lane_pair ? m.lane_pair.split('-') : ['?', '?'];
          const date = m.weeks ? new Date(m.weeks.play_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'TBD';
          
          // Calculate total scores for home and away
          let homePins = 0;
          let awayPins = 0;
          
          m.format_matches?.forEach((fm: any) => {
            fm.games?.forEach((g: any) => {
              homePins += g.home_score || 0;
              awayPins += g.away_score || 0;
            });
          });

          acc.push({
            teamName: m.home_team.name,
            lane: lanes[0],
            date,
            status: m.status,
            totalScore: homePins,
            id: `${m.id}-home`
          });
          acc.push({
            teamName: m.away_team.name,
            lane: lanes[1],
            date,
            status: m.status,
            totalScore: awayPins,
            id: `${m.id}-away`
          });
          return acc;
        }, []);

        setSessions(flattened.sort((a, b) => b.totalScore - a.totalScore));
      }
      setLoading(false);
    }
    fetchResults();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <span className="inline-block px-4 py-1 bg-ktpba-red text-white font-display text-sm font-bold uppercase tracking-[0.3em] mb-6">
          Scoreboard
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter uppercase">
          SESSION <span className="text-ktpba-red">RESULTS</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Review individual team performances and total pinfall from the latest sessions.
        </p>
      </div>

      <div className="space-y-12">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-12 h-12 text-ktpba-red animate-spin" />
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => (
              <TeamSessionCard 
                key={session.id}
                teamName={session.teamName}
                lane={session.lane}
                date={session.date}
                status={session.status}
                totalScore={session.totalScore}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-300 p-20 text-center">
            <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-gray-400 uppercase tracking-widest">No Results Yet</h2>
            <p className="text-gray-400 max-w-md mx-auto mt-4">
              The tournament is underway. Once the first sessions are finalized, scores will be published here in real-time.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-ktpba-black p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <Star className="w-10 h-10 text-ktpba-red mb-6" />
              <h3 className="font-display text-2xl font-bold mb-4 uppercase tracking-tight">Daily Leaderboards</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Every session performance is tracked to reward consistency. The high series of the day receives special recognition in our seasonal wrap-up.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ktpba-red">
                <Info className="w-4 h-4" />
                Updated Live
              </div>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-ktpba-red/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          </div>

          <div className="bg-white border border-gray-200 p-10">
            <h3 className="font-display text-2xl font-bold mb-6 uppercase tracking-tight">Scoring Format</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center font-bold text-xs flex-shrink-0">S</div>
                <div>
                  <h4 className="font-bold text-sm uppercase">Singles</h4>
                  <p className="text-gray-500 text-xs mt-1">3 Games per player. All pins added to team total.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center font-bold text-xs flex-shrink-0">D</div>
                <div>
                  <h4 className="font-bold text-sm uppercase">Doubles (Baker)</h4>
                  <p className="text-gray-500 text-xs mt-1">3 Games combined. All pins added to team total.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center font-bold text-xs flex-shrink-0">T</div>
                <div>
                  <h4 className="font-bold text-sm uppercase">Teams (Baker)</h4>
                  <p className="text-gray-500 text-xs mt-1">5 Games combined. Final contribution to total daily pinfall.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
