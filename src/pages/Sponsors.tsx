
import { motion } from 'motion/react';
import { SPONSORS } from '../constants';
import { Star } from 'lucide-react';

export default function Sponsors() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <span className="inline-block px-4 py-1 bg-ktpba-red text-white font-display text-sm font-bold uppercase tracking-[0.3em] mb-6">
          Partnership
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
          OUR <span className="text-ktpba-red">SPONSORS</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          The KTPBA Teams Marathon 2026 is made possible by the generous support of our official partners.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SPONSORS.map((sponsor, i) => (
          <motion.div
            key={sponsor}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-gray-200 p-10 flex flex-col items-center justify-center text-center group hover:border-ktpba-red transition-all shadow-sm hover:shadow-xl"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-ktpba-red/10 transition-colors">
              <Star className="w-8 h-8 text-gray-300 group-hover:text-ktpba-red transition-colors" />
            </div>
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">{sponsor}</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Official Partner</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 p-12 bg-ktpba-black text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Interested in Sponsoring?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join the most prestigious bowling event in Kenya and reach a dedicated community of athletes and fans.
          </p>
          <button className="px-8 py-4 bg-ktpba-red text-white font-display font-bold uppercase tracking-wider hover:bg-white hover:text-ktpba-black transition-all">
            Download Prospectus
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-ktpba-red/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-ktpba-green/10 rounded-full -ml-32 -mb-32 blur-3xl" />
      </div>
    </div>
  );
}
