import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DemandCard({ demand }) {
  const industryData = Object.entries(demand.industry_breakdown).map(([name, value]) => ({
    name,
    value,
  }));

  const pct = Math.round(demand.match_ratio * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Job Demand</h3>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{demand.match_count}</div>
          <div className="text-sm text-gray-500 mt-1">of {demand.total_jobs} jobs</div>
          <div className="mt-2">
            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{pct}% match rate</div>
          </div>
        </div>

        {industryData.length > 0 && (
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  dataKey="value"
                  label={({ name }) => name}
                  labelLine={false}
                >
                  {industryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
