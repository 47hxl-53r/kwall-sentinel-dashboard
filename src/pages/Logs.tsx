
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { LogsTable } from "@/components/logs/LogsTable";
import { LogsFilter } from "@/components/logs/LogsFilter";
import { LogsTabs } from "@/components/logs/LogsTabs";
import { getAllLogs, getRealtimeLogs, getBlockedLogs, LogsFilter as LogsFilterType } from "@/services/logs-api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Logs = () => {
  // State for filters
  const [filters, setFilters] = useState<LogsFilterType>({
    limit: 100,
    offset: 0,
    srv: false,
  });
  
  // State for current tab
  const [activeTab, setActiveTab] = useState<"all" | "realtime" | "blocked">("all");

  // Queries for different log types
  const allLogsQuery = useQuery({
    queryKey: ["logs", "all", filters],
    queryFn: () => getAllLogs(filters),
    enabled: activeTab === "all",
    refetchInterval: activeTab === "all" ? 10000 : false, // Refresh every 10 seconds when on "all" tab
  });

  const realtimeLogsQuery = useQuery({
    queryKey: ["logs", "realtime", filters.limit, filters.srv],
    queryFn: () => getRealtimeLogs(filters.limit, filters.srv),
    enabled: activeTab === "realtime",
    refetchInterval: activeTab === "realtime" ? 3000 : false, // Refresh more frequently for realtime logs
  });

  const blockedLogsQuery = useQuery({
    queryKey: ["logs", "blocked", filters.limit],
    queryFn: () => getBlockedLogs(filters.limit),
    enabled: activeTab === "blocked",
    refetchInterval: activeTab === "blocked" ? 5000 : false, // Refresh every 5 seconds when on "blocked" tab
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as "all" | "realtime" | "blocked");
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: LogsFilterType) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Logs Management</h2>
        </div>

        <Alert className="bg-card border-primary/20">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Monitor and analyze network traffic logs. Use the filters to narrow down results 
            and switch between tabs to view different log categories.
          </AlertDescription>
        </Alert>

        <LogsTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />

        <LogsFilter 
          filters={filters}
          onFilterChange={handleFilterChange}
          activeTab={activeTab}
        />

        {activeTab === "all" && (
          <LogsTable
            logs={allLogsQuery.data?.logs || []}
            isLoading={allLogsQuery.isLoading}
            isError={allLogsQuery.isError}
            paginationInfo={{
              total: allLogsQuery.data?.total || 0,
              limit: allLogsQuery.data?.limit || 100,
              offset: allLogsQuery.data?.offset || 0,
            }}
            onPageChange={(offset) => setFilters({ ...filters, offset })}
          />
        )}

        {activeTab === "realtime" && (
          <LogsTable
            logs={realtimeLogsQuery.data?.logs || []}
            isLoading={realtimeLogsQuery.isLoading}
            isError={realtimeLogsQuery.isError}
            isRealtime={true}
          />
        )}

        {activeTab === "blocked" && (
          <LogsTable
            logs={blockedLogsQuery.data?.logs || []}
            isLoading={blockedLogsQuery.isLoading}
            isError={blockedLogsQuery.isError}
            paginationInfo={{
              total: blockedLogsQuery.data?.total || 0,
              limit: blockedLogsQuery.data?.limit || 100,
              offset: 0,
            }}
            onPageChange={(offset) => setFilters({ ...filters, offset })}
          />
        )}
      </div>
    </Layout>
  );
};

export default Logs;
