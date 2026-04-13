
import { useState } from 'react';
import { WEEK_1_MATCHUPS } from '../../constants';
import { Trophy, ChevronRight, ChevronLeft, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { determineGameWinner } from '../../lib/scoring';

type Step = 'matchup' | 'singles' | 'doubles' | 'teams' | 'review';

export default function ScoreEntry() {
  const [step, setStep] = useState<Step>('matchup');
  const [selectedMatch, setSelectedMatch] = useState<typeof WEEK_1_MATCHUPS[0] | null>(null);
  
  // Scoring state
  const [scores, setScores] = useState({
    singles: [
      { home: '', away: '', winner: '', homePlayer: '', awayPlayer: '' },
      { home: '', away: '', winner: '', homePlayer: '', awayPlayer: '' },
      { home: '', away: '', winner: '', homePlayer: '', awayPlayer: '' },
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

  const handleScoreChange = (format: 'singles' | 'doubles' | 'teams', index: number, side: 'home' | 'away', value: string) => {
    const newScores = { ...scores };
    (newScores[format][index] as any)[side] = value;
    
    // Auto-determine winner
    const h = parseInt((newScores[format][index] as any).home);
    const a = parseInt((newScores[format][index] as any).away);
    if (!isNaN(h) && !isNaN(a)) {
      (newScores[format][index] as any).winner = determineGameWinner(h, a);
    } else {
      (newScores[format][index] as any).winner = '';
    }
    
    setScores(newScores);
  };

  const handlePlayerChange = (index: number, side: 'homePlayer' | 'awayPlayer', value: string) => {
    const newScores = { ...scores };
    newScores.singles[index][side] = value;
    setScores(newScores);
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'matchup', label: 'Select Match' },
    { id: 'singles', label: 'Singles' },
    { id: 'doubles', label: 'Doubles' },
    { id: 'teams', label: 'Teams' },
    { id: 'review', label: 'Review' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6 tracking-tight">Score Entry</h1>
        
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
            <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight border-b pb-4">Select Active Matchup</h2>
            <div className="grid grid-cols-1 gap-4">
              {WEEK_1_MATCHUPS.map((match, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMatch(match)}
                  className={cn(
                    "p-6 border-2 text-left transition-all flex items-center justify-between group",
                    selectedMatch === match ? "border-ktpba-red bg-ktpba-red/5" : "border-gray-100 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-8">
                    <span className="font-display text-xs font-bold text-gray-400 uppercase tracking-widest">{match.lanes}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-xl font-bold uppercase">{match.home}</span>
                      <span className="text-xs font-bold text-gray-300">VS</span>
                      <span className="font-display text-xl font-bold uppercase">{match.away}</span>
                    </div>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedMatch === match ? "border-ktpba-red bg-ktpba-red text-white" : "border-gray-200"
                  )}>
                    {selectedMatch === match && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {(step === 'singles' || step === 'doubles' || step === 'teams') && selectedMatch && (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b pb-6">
              <div>
                <h2 className="text-3xl font-bold uppercase tracking-tight">{step} Match</h2>
                <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">
                  {step === 'teams' ? 'Best of 5 Games' : 'Best of 3 Games'}
                  {(step === 'doubles' || step === 'teams') && ' · Baker\'s Style'}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Matchup</span>
                <span className="font-display font-bold text-sm uppercase">{selectedMatch.home} vs {selectedMatch.away}</span>
              </div>
            </div>

            <div className="space-y-8">
              {scores[step].map((_, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-sm border border-gray-100 relative">
                  <div className="absolute -top-3 left-6 px-3 bg-ktpba-black text-white text-[10px] font-bold uppercase tracking-[0.2em] py-1">
                    Game {idx + 1}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mt-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedMatch.home}</label>
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
                    
                    <div className="flex flex-col items-center justify-center gap-2">
                      {(scores[step][idx] as any).winner === 'rolloff' ? (
                        <div className="flex flex-col items-center gap-1 text-ktpba-red">
                          <AlertTriangle className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Roll-off Required</span>
                        </div>
                      ) : (scores[step][idx] as any).winner ? (
                        <div className="flex flex-col items-center gap-1 text-ktpba-green">
                          <Trophy className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            {(scores[step][idx] as any).winner === 'home' ? 'Home Win' : 'Away Win'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300 font-display text-4xl font-bold">VS</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1 text-right">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedMatch.away}</label>
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
                const homeWins = scores[f].filter(s => s.winner === 'home').length;
                const awayWins = scores[f].filter(s => s.winner === 'away').length;
                const winner = homeWins > awayWins ? selectedMatch.home : awayWins > homeWins ? selectedMatch.away : 'TBD';
                
                return (
                  <div key={f} className="border border-gray-200 p-6">
                    <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">{f}</h4>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Winner</span>
                        <span className="font-display font-bold text-lg text-ktpba-red uppercase">{winner}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Score</span>
                        <span className="font-display font-bold text-lg">{homeWins}-{awayWins}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-ktpba-black p-8 text-white">
              <h4 className="font-display font-bold uppercase tracking-widest text-ktpba-red mb-4">Summary</h4>
              <p className="text-gray-400 text-sm italic">
                "A dominant performance by {selectedMatch.home} tonight at Village Bowl, securing key wins in Singles and Teams to take the matchday points."
              </p>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-4">AI Generated Preview</p>
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
