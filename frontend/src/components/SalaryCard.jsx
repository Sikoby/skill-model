import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SalaryCard({ demand }) {
  const { salary_min, salary_max, salary_avg } = demand;

  if (salary_min === 0 && salary_max === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Salary Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">No matching jobs to show salary data</div>
        </CardContent>
      </Card>
    );
  }

  const fmt = n => `$${(n / 1000).toFixed(0)}k`;
  const avgPct = ((salary_avg - salary_min) / (salary_max - salary_min)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Salary Range
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-chart-2">{fmt(salary_avg)}</span>
          <span className="text-sm text-muted-foreground">average</span>
        </div>

        <div className="relative">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{fmt(salary_min)}</span>
            <span>{fmt(salary_max)}</span>
          </div>
          <div className="h-3 bg-gradient-to-r from-chart-2/30 via-chart-2/60 to-chart-2 rounded-full relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-chart-2 rounded-full shadow"
              style={{ left: `${avgPct}%`, transform: `translateX(-50%) translateY(-50%)` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
