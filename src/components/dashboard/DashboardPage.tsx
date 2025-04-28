
import { StatsOverview } from "./StatsOverview";
import { TrafficCharts } from "./TrafficCharts";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <StatsOverview />
      
      <TrafficCharts />

      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}
