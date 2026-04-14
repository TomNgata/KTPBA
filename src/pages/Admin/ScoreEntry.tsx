import { useState, useEffect } from 'react';
import { Trophy, ChevronRight, ChevronLeft, Save, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { determineGameWinner } from '../../lib/scoring';
import { getSupabase } from '../../lib/supabase';

type Step = 'matchup' | 'singles' | 'doubles' | 'teams' | 'review';

export default function ScoreEntry() {
  const [step, setStep] = useState<Step>('matchup');
  const [matchups, setMatchups] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Scoring state
  const [scores, setScores] = useState({
    singles: [
      { home: '', away: '', winner: '', homePlayer: '', awayPlayer: '', homePlayerId: '', awayPlayerId: '' },
      { home: '', away: '', winner: '', homePlayer: '', awayPlayer: '', homePlayerId: '', awayPlayerId: '' },
      { home: '', away: '', winner: '', homePlayer: '', awayPlayer: '', homePlayerId: '', awayPlayerId: '' },
    ],
    doubles: [
      { home: '', away: '', winner: '' },
      { home: '', away: '', winner: '' },
      { home: '', away: '', winner: '' },
    ],
    teams: [
      { home: '', away: '', winner: '' },
      { home: '', away: '', winner: '' },
      { home: '', away: '', winner: '' },
      { home: '', away: '', winner: '' },
      { home: '', away: '', winner: '' },
    ],
  });

  useEffect(() => {
    async function fetchMatchups() {
      const supabase = getSupabase();
      if (!supabase) return;

      setLoading(true);
      const { data } = await supabase
        .from('matchups')
        .select('*, home_team:teams!home_team_id(id, name), away_team:teams!away_team_id(id, name)')
        .eq('status', 'scheduled');
      
      if (data) setMatchups(data);
      setLoading(false);
    }
    fetchMatchups();
  }, []);

  const handleScoreChange = (format: 'singles' | 'doubles' | 'teams', index: number, side: 'home' | 'away', value: string) => {
    const newScores = { ...scores };
    (newScores[format][index] as any)[side] = value;
    setScores(newScores);
  };

  const handlePublish = async () => {
    if (!selectedMatch) return;
    const supabase = getSupabase();
    if (!supabase) return;

    setLoading(true);
    try {
      const formats = ['singles', 'doubles', 'teams'] as const;
      
      for (const f of formats) {
        // 1. Get or Create Format Match record
        let { data: fm } = await supabase
          .from('format_matches')
          .select('id')
          .eq('matchup_id', selectedMatch.id)
          .eq('format', f)
          .single();
        
        let formatMatchId = fm?.id;
        
        if (!formatMatchId) {
          const { data: newFm } = await supabase
            .from('format_matches')
            .insert({ matchup_id: selectedMatch.id, format: f })
            .select('id')
            .single();
          formatMatchId = newFm?.id;
        }

        if (formatMatchId) {
          // 2. Prepare Game data with Winner Logic
          const gameData = (scores as any)[f].map((g: any, i: number) => {
            const hScore = parseInt(g.home) || 0;
            const aScore = parseInt(g.away) || 0;
            
            // Determine winner for Match Points
            let winnerId = null;
            if (hScore > aScore) winnerId = selectedMatch.home_team_id;
            else if (aScore > hScore && selectedMatch.away_team_id) winnerId = selectedMatch.away_team_id;
            else if (hScore > 0 && !selectedMatch.away_team_id) winnerId = selectedMatch.home_team_id; // Seeding round auto-win

            return {
              format_match_id: formatMatchId,
              game_number: i + 1,
              home_score: hScore,
              away_score: aScore,
              winner_team_id: winnerId
            };
          });

          // 3. Clear existing games if re-entering
          await supabase.from('games').delete().eq('format_match_id', formatMatchId);
          await supabase.from('games').insert(gameData);

          // 4. Update format match status (and aggregated wins for convenience)
          const homeWins = gameData.filter((g: any) => g.winner_team_id === selectedMatch.home_team_id).length;
          const awayWins = selectedMatch.away_team_id ? gameData.filter((g: any) => g.winner_team_id === selectedMatch.away_team_id).length : 0;
          
          let formatWinnerId = null;
          if (homeWins > awayWins) formatWinnerId = selectedMatch.home_team_id;
          else if (awayWins > homeWins) formatWinnerId = selectedMatch.away_team_id;

          await supabase.from('format_matches').update({
            status: 'completed',
            home_wins: homeWins,
            away_wins: awayWins,
            winner_team_id: formatWinnerId
          }).eq('id', formatMatchId);
        }
      }

      await supabase.from('matchups').update({ status: 'done' }).eq('id', selectedMatch.id);

      alert('All session scores and match points published successfully!');
      setStep('matchup');
      setSelectedMatch(null);
    } catch (err) {
      console.error('Failed to publish scores:', err);
      alert('Error publishing scores. Check console.');
    }
    setLoading(false);
  };

  const handlePlayerChange = (index: number, side: 'homePlayer' | 'awayPlayer', value: string) => {
    const newScores = { ...scores };
    newScores.singles[index][side] = value;
    setScores(newScores);
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'matchup', label: 'Select Session' },
    { id: 'singles', label: 'Singles' },
    { id: 'doubles', label: 'Doubles' },
    { id: 'teams', label: 'Teams' },
    { id: 'review', label: 'Review' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6 tracking-tight uppercase">Score Entry</h1>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "h-2 flex-grow rounded-full transition-all",
                steps.findIndex(x => x.id === step) >= i ? "bg-ktpba-red" : "bg-gray-200"
              )} />
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((s) => (
            <span key={s.id} className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              step === s.id ? "text-ktpba-red" : "text-gray-400"
            )}>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-xl p-8 min-h-[500px] flex flex-col">
        {step === 'matchup' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight border-b pb-4">Select Active Session</h2>
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="w-12 h-12 text-ktpba-red animate-spin" />
                </div>
              ) : matchups.length > 0 ? matchups.map((match, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMatch(match)}
                  className={cn(
                    "p-6 border-2 text-left transition-all flex items-center justify-between group",
                    selectedMatch === match ? "border-ktpba-red bg-ktpba-red/5" : "border-gray-100 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-8">
                    <span className="font-display text-xs font-bold text-gray-400 uppercase tracking-widest">{match.lane_pair}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-xl font-bold uppercase">{match.home_team?.name}</span>
                      <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">&</span>
                      <span className="font-display text-xl font-bold uppercase">{match.away_team?.name}</span>
                    </div>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedMatch === match ? "border-ktpba-red bg-ktpba-red text-white" : "border-gray-200"
                  )}>
                    {selectedMatch === match && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </button>
              )) : (
                <div className="py-20 text-center border-2 border-dashed border-gray-100">
                  <span className="text-gray-400 font-display text-xs font-bold uppercase tracking-widest">No active sessions scheduled for entry</span>
                </div>
              )}
            </div>

          </div>
        )}

        {(step === 'singles' || step === 'doubles' || step === 'teams') && selectedMatch && (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b pb-6">
              <div>
                <h2 className="text-3xl font-bold uppercase tracking-tight">{step} Session</h2>
                <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">
                  {step === 'teams' ? '5 Games Series' : '3 Games Series'}
                  {(step === 'doubles' || step === 'teams') && ' · Baker\'s Style'}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lane Pairing</span>
                <span className="font-display font-bold text-sm uppercase">
                  {selectedMatch.lane_pair || selectedMatch.lanes}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              {scores[step].map((_, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-sm border border-gray-100 relative">
                  <div className="absolute -top-3 left-6 px-3 bg-ktpba-black text-white text-[10px] font-bold uppercase tracking-[0.2em] py-1">
                    Game {idx + 1}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedMatch.home_team?.name}</label>
                        {step === 'singles' && (
                          <input 
                            type="text" 
                            placeholder="Player Name"
                            value={scores.singles[idx].homePlayer}
                            onChange={(e) => handlePlayerChange(idx, 'homePlayer', e.target.value)}
                            className="bg-white border border-gray-200 p-2 text-xs focus:border-ktpba-red outline-none"
                          />
                        )}
                      </div>
                      <input 
                        type="number" 
                        placeholder="Pins"
                        value={(scores[step][idx] as any).home}
                        onChange={(e) => handleScoreChange(step, idx, 'home', e.target.value)}
                        className="bg-white border-2 border-gray-200 p-4 font-display text-2xl font-bold focus:border-ktpba-red outline-none transition-all"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1 text-right">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedMatch.away_team?.name}</label>
                        {step === 'singles' && (
                          <input 
                            type="text" 
                            placeholder="Player Name"
                            value={scores.singles[idx].awayPlayer}
                            onChange={(e) => handlePlayerChange(idx, 'awayPlayer', e.target.value)}
                            className="bg-white border border-gray-200 p-2 text-xs focus:border-ktpba-red outline-none text-right"
                          />
                        )}
                      </div>
                      <input 
                        type="number" 
                        placeholder="Pins"
                        value={(scores[step][idx] as any).away}
                        onChange={(e) => handleScoreChange(step, idx, 'away', e.target.value)}
                        className="bg-white border-2 border-gray-200 p-4 font-display text-2xl font-bold focus:border-ktpba-red outline-none transition-all text-right"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'review' && selectedMatch && (
          <div className="space-y-10">
            <h2 className="text-3xl font-bold uppercase tracking-tight border-b pb-6">Final Review</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['singles', 'doubles', 'teams'] as const).map(f => {
                const homeTotal = scores[f].reduce((sum, s) => sum + (parseInt(s.home) || 0), 0);
                const awayTotal = scores[f].reduce((sum, s) => sum + (parseInt(s.away) || 0), 0);
                
                return (
                  <div key={f} className="border border-gray-200 p-6">
                    <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">{f} Totals</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-600 uppercase truncate max-w-[100px]">{selectedMatch.home_team?.name}</span>
                        <span className="font-display font-bold text-lg text-ktpba-red">{homeTotal}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-600 uppercase truncate max-w-[100px]">{selectedMatch.away_team?.name}</span>
                        <span className="font-display font-bold text-lg text-ktpba-red">{awayTotal}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-ktpba-black p-8 text-white">
              <h4 className="font-display font-bold uppercase tracking-widest text-ktpba-red mb-4">Daily Performance Summary</h4>
              <p className="text-gray-400 text-sm italic">
                "Verified scores for {selectedMatch.home_team?.name || selectedMatch.home} and {selectedMatch.away_team?.name || selectedMatch.away} at Village Bowl. Total pinfall calculated for seasonal leaderboard inclusion."
              </p>
            </div>
          </div>
        )}

        <div className="mt-auto pt-12 flex justify-between">
          <button
            onClick={() => {
              const prevIdx = steps.findIndex(s => s.id === step) - 1;
              if (prevIdx >= 0) setStep(steps[prevIdx].id);
            }}
            disabled={step === 'matchup'}
            className="px-8 py-4 border border-gray-200 font-display font-bold uppercase tracking-wider hover:bg-gray-50 disabled:opacity-30 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          
          {step === 'review' ? (
            <button
              onClick={handlePublish}
              className="px-8 py-4 bg-ktpba-green text-white font-display font-bold uppercase tracking-wider hover:bg-ktpba-black transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Publish Results
            </button>
          ) : (
            <button
              onClick={() => {
                const nextIdx = steps.findIndex(s => s.id === step) + 1;
                if (nextIdx < steps.length) setStep(steps[nextIdx].id);
              }}
              disabled={step === 'matchup' && !selectedMatch}
              className="px-8 py-4 bg-ktpba-red text-white font-display font-bold uppercase tracking-wider hover:bg-ktpba-black transition-all flex items-center gap-2"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
