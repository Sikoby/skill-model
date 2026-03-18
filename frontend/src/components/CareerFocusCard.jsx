import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  weight: {
    label: 'Job Demand',
    color: 'var(--chart-1)',
  },
};

export default function CareerFocusCard({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Career Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">You already cover all required skills!</div>
        </CardContent>
      </Card>
    );
  }

  const data = recommendations.map(r => ({
    skill: r.skill.length > 25 ? r.skill.slice(0, 22) + '...' : r.skill,
    fullSkill: r.skill,
    weight: Math.round(r.weight * 100),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Career Focus
        </CardTitle>
        <CardDescription>Skills to learn next for maximum job market impact</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full" style={{ height: data.length * 36 + 20 }}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} fontSize={11} />
            <YAxis type="category" dataKey="skill" width={160} fontSize={11} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => [`${value}% of jobs require this`, props.payload.fullSkill]}
                />
              }
            />
            <Bar dataKey="weight" fill="var(--color-weight)" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
