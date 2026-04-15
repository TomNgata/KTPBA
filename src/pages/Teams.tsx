
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Users, Loader2, ArrowRight } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import EmptyState from '../components/EmptyState';

export default function Teams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (data) setTeams(data);
      setLoading(false);
    }
    fetchTeams();
  }, []);

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
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="w-12 h-12 text-ktpba-red animate-spin" />
          </div>
        ) : teams.length > 0 ? (
          teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link 
                to={`/teams/${team.slug}`}
                className="group bg-white border border-gray-200 p-8 flex flex-col items-center text-center hover:border-ktpba-red transition-all shadow-sm hover:shadow-xl relative overflow-hidden h-full"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-ktpba-red transition-colors" />
                
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-ktpba-red/10 transition-colors">
                  <Users className="w-8 h-8 text-gray-300 group-hover:text-ktpba-red transition-colors" />
                </div>

                <h3 className="font-display text-xl font-bold uppercase tracking-tight mb-4 group-hover:text-ktpba-red transition-colors line-clamp-2 min-h-[3.5rem]">
                  {team.name}
                </h3>

                <div className="flex flex-col items-center gap-2 mb-6">
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full",
                    team.group_name === 'A' ? "bg-blue-50 text-blue-600" : 
                    team.group_name === 'B' ? "bg-purple-50 text-purple-600" : 
                    "bg-gray-50 text-gray-400"
                  )}>
                    {team.group_name ? `Group ${team.group_name}` : 'UNASSIGNED'}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50 w-full justify-center">
                   <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                    <span className="font-display font-bold text-xs uppercase text-ktpba-green">Competing</span>
                  </div>
                </div>

                <div className="mt-6 text-ktpba-red opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                  View Profile <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <EmptyState 
            icon={Users}
            title="Recruiting the Elite"
            description="The registration phase for the 2026 Marathon is nearing completion. The official roster of contenders will be unveiled here shortly."
            actionLabel="Back to Home"
            actionLink="/"
          />
        )}
      </div>
    </div>
  );
}

