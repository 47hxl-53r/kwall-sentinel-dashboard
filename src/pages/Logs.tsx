
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Loader2, Trash2, RefreshCw, Server } from "lucide-react";
import { LogsTable } from "@/components/logs/LogsTable";
import { BlockedLogsTable } from "@/components/logs/BlockedLogsTable";
import { LogStatistics } from "@/components/logs/LogStatistics";
import { getRealtimeLogs, getBlockedLogs, getLogStats, clearLogs } from "@/services/api";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Logs = () => {
  const [activeTab, setActiveTab] = useState("realtime");
  const [logLimit, setLogLimit] = useState(100);
  const [includeServerLogs, setIncludeServerLogs] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch realtime logs
  const realtimeLogs = useQuery({
    queryKey: ["realtimeLogs", logLimit, includeServerLogs],
    queryFn: () => getRealtimeLogs(logLimit, includeServerLogs),
    refetchInterval: activeTab === "realtime" ? 5000 : false,
  });
  
  // Fetch blocked logs
  const blockedLogs = useQuery({
    queryKey: ["blockedLogs", logLimit],
    queryFn: () => getBlockedLogs(logLimit),
    refetchInterval: activeTab === "blocked" ? 5000 : false,
  });
  
  // Fetch log statistics
  const logStats = useQuery({
    queryKey: ["logStats"],
    queryFn: getLogStats,
    refetchInterval: activeTab === "statistics" ? 5000 : false,
  });
  
  // Clear logs mutation
  const clearLogsMutation = useMutation({
    mutationFn: clearLogs,
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidate all logs queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["realtimeLogs"] });
      queryClient.invalidateQueries({ queryKey: ["blockedLogs"] });
      queryClient.invalidateQueries({ queryKey: ["logStats"] });
    },
  });
  
  const handleClearLogs = (options: { clearRealtime?: boolean; clearBlocked?: boolean; clearStats?: boolean }) => {
    clearLogsMutation.mutate(options);
  };
  
  const refreshLogs = () => {
    if (activeTab === "realtime") {
      queryClient.invalidateQueries({ queryKey: ["realtimeLogs"] });
    } else if (activeTab === "blocked") {
      queryClient.invalidateQueries({ queryKey: ["blockedLogs"] });
    } else if (activeTab === "statistics") {
      queryClient.invalidateQueries({ queryKey: ["logStats"] });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Log Analysis</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshLogs} 
              disabled={realtimeLogs.isFetching || blockedLogs.isFetching || logStats.isFetching}
            >
              {(realtimeLogs.isFetching || blockedLogs.isFetching || logStats.isFetching) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Logs
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Logs</AlertDialogTitle>
                  <AlertDialogDescription>
                    Select which logs you want to clear. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleClearLogs({ clearRealtime: true })}
                    disabled={clearLogsMutation.isPending}
                  >
                    Clear Realtime Logs
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleClearLogs({ clearBlocked: true })}
                    disabled={clearLogsMutation.isPending}
                  >
                    Clear Blocked Logs
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleClearLogs({ clearStats: true })}
                    disabled={clearLogsMutation.isPending}
                  >
                    Clear Statistics
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleClearLogs({ clearRealtime: true, clearBlocked: true, clearStats: true })}
                    disabled={clearLogsMutation.isPending}
                  >
                    Clear All Logs
                  </Button>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <Tabs defaultValue="realtime" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="realtime">Realtime Logs</TabsTrigger>
              <TabsTrigger value="blocked">Blocked Traffic</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>
            
            {activeTab === "realtime" && (
              <Toggle 
                pressed={includeServerLogs} 
                onPressedChange={setIncludeServerLogs}
                aria-label="Include server logs"
              >
                <Server className="h-4 w-4 mr-2" />
                Include Server Logs
              </Toggle>
            )}
          </div>
          
          <TabsContent value="realtime" className="space-y-4">
            {realtimeLogs.isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : realtimeLogs.isError ? (
              <div className="text-center p-8 text-destructive">
                <p>Failed to load logs</p>
              </div>
            ) : realtimeLogs.data?.logs?.length ? (
              <LogsTable logs={realtimeLogs.data.logs} />
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <p>No logs available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="blocked" className="space-y-4">
            {blockedLogs.isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : blockedLogs.isError ? (
              <div className="text-center p-8 text-destructive">
                <p>Failed to load blocked traffic</p>
              </div>
            ) : blockedLogs.data?.blocked_requests?.length ? (
              <BlockedLogsTable logs={blockedLogs.data.blocked_requests} />
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <p>No blocked traffic available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="statistics" className="space-y-4">
            {logStats.isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : logStats.isError ? (
              <div className="text-center p-8 text-destructive">
                <p>Failed to load statistics</p>
              </div>
            ) : (
              <LogStatistics data={logStats.data} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Logs;
