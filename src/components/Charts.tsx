import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { cn } from '../lib/utils';

// --- Divisional Performance Chart (Cumulative Match Points per Week) ---

interface WeeklyEntry {
  week: string;
  [teamName: string]: string | number;
}

interface DivisionChartProps {
  data: WeeklyEntry[];
  teams: string[];
  title: string;
}

const CHART_COLORS = [
  '#D32F2F', '#1565C0', '#2E7D32', '#E65100', '#6A1B9A',
  '#00838F', '#F9A825', '#AD1457', '#37474F', '#558B2F',
];

export function DivisionChart({ data, teams, title }: DivisionChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 border border-dashed border-gray-200 text-gray-400 text-sm font-bold uppercase tracking-widest">
        No match data yet
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-display font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-2">
        <span className="w-3 h-3 bg-ktpba-red inline-block" />
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
          <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ fontSize: '11px', fontWeight: 700, border: '1px solid #e5e7eb', borderRadius: '2px' }}
            labelStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '12px' }}
          />
          {teams.map((team, i) => (
            <Line
              key={team}
              type="monotone"
              dataKey={team}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// --- Pinfall Distribution Chart (Stacked horizontal bar per team) ---

interface PinfallEntry {
  team: string;
  singles: number;
  doubles: number;
  teams: number;
}

interface PinfallDistributionChartProps {
  data: PinfallEntry[];
}

export function PinfallDistributionChart({ data }: PinfallDistributionChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 border border-dashed border-gray-200 text-gray-400 text-sm font-bold uppercase tracking-widest">
        No pinfall data yet
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-6 mb-4 flex-wrap">
        {[
          { label: 'Singles', color: '#D32F2F' },
          { label: 'Doubles', color: '#1565C0' },
          { label: 'Teams', color: '#111111' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 100, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
          <YAxis
            type="category"
            dataKey="team"
            width={100}
            tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }}
          />
          <Tooltip
            contentStyle={{ fontSize: '11px', fontWeight: 700, border: '1px solid #e5e7eb', borderRadius: '2px' }}
            formatter={(value: number, name: string) => [value.toLocaleString(), name.charAt(0).toUpperCase() + name.slice(1)]}
          />
          <Bar dataKey="singles" stackId="a" fill="#D32F2F" name="Singles" radius={[0, 0, 0, 0]} />
          <Bar dataKey="doubles" stackId="a" fill="#1565C0" name="Doubles" />
          <Bar dataKey="teams" stackId="a" fill="#111111" name="Teams" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
