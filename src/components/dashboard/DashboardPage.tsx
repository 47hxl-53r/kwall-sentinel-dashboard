
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { StatsOverview } from "./StatsOverview";
import { TrafficCharts } from "./TrafficCharts";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";

export function DashboardPage() {
  const queryClient = useQueryClient();
  
  // Initial data fetch when component mounts
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["logStats"] });
  }, [queryClient]);

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
