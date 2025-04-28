
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { RealtimeLogsTab } from "@/components/logs/RealtimeLogsTab";
import { BlockedLogsTab } from "@/components/logs/BlockedLogsTab";
import { StatisticsTab } from "@/components/logs/StatisticsTab";
import { LogsClearDialog } from "@/components/logs/LogsClearDialog";

const Logs = () => {
  const [activeTab, setActiveTab] = useState("realtime");
  const [logLimit] = useState(100);
  const queryClient = useQueryClient();
  
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
            >
              <RefreshCw className="h-4 w-4" />
              <span className="ml-2">Refresh</span>
            </Button>
            
            <LogsClearDialog />
          </div>
        </div>
        
        <Tabs defaultValue="realtime" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="realtime">Realtime Logs</TabsTrigger>
            <TabsTrigger value="blocked">Blocked Traffic</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="realtime" className="space-y-4">
            <RealtimeLogsTab logLimit={logLimit} />
          </TabsContent>
          
          <TabsContent value="blocked" className="space-y-4">
            <BlockedLogsTab logLimit={logLimit} />
          </TabsContent>
          
          <TabsContent value="statistics" className="space-y-4">
            <StatisticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Logs;
