
import { motion } from 'motion/react';
import { TEAMS } from '../constants';
import { Link } from 'react-router-dom';
import { Users, Trophy, ArrowRight } from 'lucide-react';

export default function Teams() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <span className="inline-block px-4 py-1 bg-ktpba-red text-white font-display text-sm font-bold uppercase tracking-[0.3em] mb-6">
          The Contenders
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
          MEET THE <span className="text-ktpba-red">TEAMS</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          20 elite teams competing for glory in the 2026 KTPBA Teams Marathon.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAMS.map((team, i) => (
          <motion.div
            key={team}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link 
              to={`/teams/${team.toLowerCase().replace(/ /g, '-')}`}
              className="group bg-white border border-gray-200 p-8 flex flex-col items-center text-center hover:border-ktpba-red transition-all shadow-sm hover:shadow-xl relative overflow-hidden h-full"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-ktpba-red transition-colors" />
              
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-ktpba-red/10 transition-colors">
                <Users className="w-8 h-8 text-gray-300 group-hover:text-ktpba-red transition-colors" />
              </div>

              <h3 className="font-display text-xl font-bold uppercase tracking-tight mb-4 group-hover:text-ktpba-red transition-colors line-clamp-2 min-h-[3.5rem]">
                {team}
              </h3>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50 w-full justify-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points</span>
                  <span className="font-display font-bold text-lg">0</span>
                </div>
                <div className="w-[1px] h-8 bg-gray-100" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rank</span>
                  <span className="font-display font-bold text-lg">--</span>
                </div>
              </div>

              <div className="mt-6 text-ktpba-red opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                View Profile <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
