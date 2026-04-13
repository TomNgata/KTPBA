
import { Trophy, Star, Info } from 'lucide-react';

export default function Results() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <span className="inline-block px-4 py-1 bg-ktpba-red text-white font-display text-sm font-bold uppercase tracking-[0.3em] mb-6">
          Scoreboard
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
          MATCH <span className="text-ktpba-red">RESULTS</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Review the latest scores and format winners from the 2026 marathon.
        </p>
      </div>

      <div className="space-y-12">
        <div className="bg-gray-50 border border-dashed border-gray-300 p-20 text-center">
          <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-6" />
          <h2 className="font-display text-2xl font-bold text-gray-400 uppercase tracking-widest">No Results Yet</h2>
          <p className="text-gray-400 max-w-md mx-auto mt-4">
            The tournament starts on 13 April 2026. Once the first matches are completed, scores will be published here in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-ktpba-black p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <Star className="w-10 h-10 text-ktpba-red mb-6" />
              <h3 className="font-display text-2xl font-bold mb-4 uppercase tracking-tight">AI Match Summaries</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Every match result is analyzed by Gemini 1.5 Pro to provide a concise recap of the action, key turning points, and standout team performances.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ktpba-red">
                <Info className="w-4 h-4" />
                Coming Soon
              </div>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-ktpba-red/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          </div>

          <div className="bg-white border border-gray-200 p-10">
            <h3 className="font-display text-2xl font-bold mb-6 uppercase tracking-tight">How to Read Results</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center font-bold text-xs flex-shrink-0">S</div>
                <div>
                  <h4 className="font-bold text-sm uppercase">Singles Match</h4>
                  <p className="text-gray-500 text-xs mt-1">Best of 3 games. Winner gets 1 point.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center font-bold text-xs flex-shrink-0">D</div>
                <div>
                  <h4 className="font-bold text-sm uppercase">Doubles Match</h4>
                  <p className="text-gray-500 text-xs mt-1">Best of 3 games. Winner gets 1 point.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center font-bold text-xs flex-shrink-0">T</div>
                <div>
                  <h4 className="font-bold text-sm uppercase">Teams (Baker)</h4>
                  <p className="text-gray-500 text-xs mt-1">Best of 3 games. Winner gets 1 point.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
