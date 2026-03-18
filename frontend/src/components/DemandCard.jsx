import { PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'oklch(0.7 0.15 300)',
];

export default function DemandCard({ demand }) {
  const industryData = Object.entries(demand.industry_breakdown).map(([name, value]) => ({
    name,
    value,
  }));

  const pct = Math.round(demand.match_ratio * 100);

  const chartConfig = Object.fromEntries(
    industryData.map(({ name }, i) => [
      name,
      { label: name, color: COLORS[i % COLORS.length] },
    ])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Job Demand
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">{demand.match_count}</div>
            <div className="text-sm text-muted-foreground mt-1">of {demand.total_jobs} jobs</div>
            <div className="mt-2">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <Badge variant="secondary" className="mt-1.5">{pct}% match rate</Badge>
            </div>
          </div>

          {industryData.length > 0 && (
            <div className="flex-1">
              <ChartContainer config={chartConfig} className="aspect-square max-h-[120px]">
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={50}
                    dataKey="value"
                    nameKey="name"
                    label={({ name }) => name}
                    labelLine={false}
                  >
                    {industryData.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
