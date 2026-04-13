
import { WEEK_1_MATCHUPS, TEAMS } from '../../constants';
import { Calendar, Plus, MapPin, Edit2, Trash2 } from 'lucide-react';

export default function ScheduleAdmin() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Schedule Management</h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs">Matchups & Lane Assignments</p>
        </div>
        
        <button className="px-6 py-3 bg-ktpba-red text-white font-display font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-ktpba-black transition-all">
          <Plus className="w-5 h-5" /> Add Matchup
        </button>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Week 01</h2>
            <div className="h-[2px] flex-grow bg-gray-100" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">13 April 2026</span>
          </div>

          <div className="bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-4">Lanes</th>
                  <th className="px-6 py-4">Home Team</th>
                  <th className="px-6 py-4">Away Team</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {WEEK_1_MATCHUPS.map((match, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-ktpba-red">{match.lanes}</td>
                    <td className="px-6 py-4 font-bold text-sm uppercase">{match.home}</td>
                    <td className="px-6 py-4 font-bold text-sm uppercase">{match.away}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-sm">Scheduled</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-ktpba-black transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-ktpba-red transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-400">TBD Matchups</h2>
            <div className="h-[2px] flex-grow bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 border-2 border-dashed border-gray-200 flex items-center justify-between group hover:border-ktpba-red transition-all">
                <div className="flex items-center gap-6">
                  <MapPin className="w-6 h-6 text-gray-200 group-hover:text-ktpba-red transition-colors" />
                  <div>
                    <h4 className="font-display font-bold text-lg uppercase text-gray-300 group-hover:text-ktpba-black transition-colors">TBD vs TBD</h4>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Lanes TBD</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-ktpba-red uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Set Pairing
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
