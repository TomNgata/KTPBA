
import { useParams, Link } from 'react-router-dom';
import { TEAMS } from '../constants';
import { Trophy, Users, Calendar, ArrowLeft, Info } from 'lucide-react';

export default function TeamDetail() {
  const { slug } = useParams();
  const teamName = TEAMS.find(t => t.toLowerCase().replace(/ /g, '-') === slug) || 'Unknown Team';

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
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">{teamName}</h1>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center">
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Rank</span>
              <span className="font-display text-3xl font-bold">--</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Points</span>
              <span className="font-display text-3xl font-bold">0</span>
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
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No matches played yet</p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 border-b-2 border-ktpba-black pb-2">Format Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Singles', 'Doubles', 'Teams'].map(format => (
                <div key={format} className="bg-white border border-gray-200 p-6">
                  <h4 className="font-display font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">{format}</h4>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-display font-bold">0</span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Wins</span>
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
            <h3 className="font-display font-bold uppercase tracking-wider mb-6">Upcoming Match</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Week 01</span>
                <span>Mon 13 Apr</span>
              </div>
              <div className="font-display font-bold text-lg uppercase">VS TBD</div>
              <div className="text-xs text-gray-500">Village Bowl · 6:45 PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
