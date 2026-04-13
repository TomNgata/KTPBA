
import { TEAMS } from '../../constants';
import { Users, Search, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PlayerAdmin() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Player Management</h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs">Roster & Participation Tracking</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search players..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-sm focus:border-ktpba-red outline-none text-sm"
            />
          </div>
          <button className="px-4 py-2 bg-ktpba-black text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-display font-bold uppercase tracking-wider text-gray-400 text-xs mb-4">Teams</h3>
          <div className="bg-white border border-gray-200 divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {TEAMS.map((team) => (
              <button key={team} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors font-medium">
                {team}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-4">Player Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Singles</th>
                  <th className="px-6 py-4 text-center">Doubles</th>
                  <th className="px-6 py-4 text-center">Teams</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm">Player {i}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 uppercase">{i === 1 ? 'Captain' : 'Member'}</td>
                    <td className="px-6 py-4 text-center font-mono text-xs">0</td>
                    <td className="px-6 py-4 text-center font-mono text-xs">0</td>
                    <td className="px-6 py-4 text-center font-mono text-xs">0</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Ineligible</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-500 mt-1" />
              <div>
                <h4 className="font-bold uppercase text-sm">Eligibility Warning</h4>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                  The following players have not yet met the minimum participation requirement (at least one game in Singles and one game in Doubles). 
                  Failure to comply by the end of the season will result in team point deductions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
