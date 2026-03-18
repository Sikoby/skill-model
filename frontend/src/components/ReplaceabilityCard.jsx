import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function ReplaceabilityCard({ replaceability }) {
  const score = Math.round(replaceability.replacement_score * 100);

  let badgeVariant, label;
  if (score < 40) {
    badgeVariant = 'secondary';
    label = 'Low Risk';
  } else if (score < 70) {
    badgeVariant = 'outline';
    label = 'Moderate Risk';
  } else {
    badgeVariant = 'destructive';
    label = 'High Risk';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          AI Replaceability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="text-center space-y-2">
            <div className="text-5xl font-bold text-foreground">{score}%</div>
            <Badge variant={badgeVariant}>{label}</Badge>
            <Progress value={score} className="w-32 mt-2" />
          </div>

          <div className="flex-1 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jobs you qualify for</span>
              <span className="font-medium text-foreground">{replaceability.human_match_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jobs AI can do</span>
              <span className="font-medium text-foreground">{replaceability.agent_match_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Overlap (both)</span>
              <span className="font-medium text-foreground">{replaceability.both_match_count}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Only you</span>
              <span className="font-semibold text-chart-2">{replaceability.human_only_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Only AI</span>
              <span className="font-semibold text-destructive">{replaceability.agent_only_count}</span>
            </div>
          </div>
        </div>

        {replaceability.human_only_jobs?.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Jobs only you qualify for:</div>
              <div className="flex flex-wrap gap-1.5">
                {replaceability.human_only_jobs.map((job, i) => (
                  <Badge key={i} variant="outline">{job.title}</Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
