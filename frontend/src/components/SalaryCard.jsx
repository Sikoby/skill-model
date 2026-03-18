export default function SalaryCard({ demand }) {
  const { salary_min, salary_max, salary_avg } = demand;

  if (salary_min === 0 && salary_max === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Salary Range</h3>
        <div className="text-gray-400 text-sm">No matching jobs to show salary data</div>
      </div>
    );
  }

  const fmt = n => `$${(n / 1000).toFixed(0)}k`;
  const avgPct = ((salary_avg - salary_min) / (salary_max - salary_min)) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Salary Range</h3>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-green-600">{fmt(salary_avg)}</span>
        <span className="text-sm text-gray-500">average</span>
      </div>

      <div className="relative">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{fmt(salary_min)}</span>
          <span>{fmt(salary_max)}</span>
        </div>
        <div className="h-3 bg-gradient-to-r from-green-200 via-green-400 to-green-600 rounded-full relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-green-600 rounded-full shadow"
            style={{ left: `${avgPct}%`, transform: `translateX(-50%) translateY(-50%)` }}
          />
        </div>
      </div>
    </div>
  );
}
