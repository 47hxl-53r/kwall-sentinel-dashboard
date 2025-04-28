
import { useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { StatsOverview } from "./StatsOverview";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";
import { getLogStats } from "@/services/api";
import { Loader2 } from "lucide-react";

export function DashboardPage() {
  const queryClient = useQueryClient();
  
  // Fetch log statistics
  const { data: logStats, isLoading, isError } = useQuery({
    queryKey: ["logStats"],
    queryFn: getLogStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  // Initial data fetch when component mounts
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["logStats"] });
  }, [queryClient]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center p-8 text-destructive">
          <p>Failed to load dashboard data</p>
        </div>
      ) : (
        <>
          <StatsOverview stats={logStats?.stats} />
          
          <div className="grid gap-4 md:grid-cols-2">
            <RecentActivity />
            <QuickActions />
          </div>
        </>
      )}
    </div>
  );
}
