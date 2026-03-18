import { Card, CardContent } from '@/components/ui/card';
import DemandCard from './DemandCard';
import SalaryCard from './SalaryCard';
import CareerFocusCard from './CareerFocusCard';
import ReplaceabilityCard from './ReplaceabilityCard';

export default function Dashboard({ data }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Card className="border-dashed">
          <CardContent className="text-center py-12 px-16">
            <div className="text-6xl mb-4">&#x1F4CA;</div>
            <div className="text-lg font-medium">Select your skills and click Analyze</div>
            <div className="text-sm text-muted-foreground mt-2">to see your career dashboard</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DemandCard demand={data.demand} />
        <SalaryCard demand={data.demand} />
      </div>
      <CareerFocusCard recommendations={data.learning_recommendations} />
      <ReplaceabilityCard replaceability={data.replaceability} />
    </div>
  );
}
