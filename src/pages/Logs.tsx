
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { RealTimeLogs } from "@/components/logs/RealTimeLogs";
import { BlockedLogs } from "@/components/logs/BlockedLogs";
import { LogStats } from "@/components/logs/LogStats";
import { LogActions } from "@/components/logs/LogActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Logs = () => {
  const [activeTab, setActiveTab] = useState("realtime");

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Log Analysis</h2>
          <p className="text-muted-foreground">
            Monitor and analyze network traffic logs
          </p>
        </div>
        
        <Tabs defaultValue="realtime" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="realtime">Real-Time Logs</TabsTrigger>
            <TabsTrigger value="blocked">Blocked Traffic</TabsTrigger>
            <TabsTrigger value="stats">Traffic Analysis</TabsTrigger>
            <TabsTrigger value="management">Log Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="realtime" className="space-y-4">
            <RealTimeLogs />
          </TabsContent>
          
          <TabsContent value="blocked" className="space-y-4">
            <BlockedLogs />
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <LogStats />
          </TabsContent>
          
          <TabsContent value="management" className="space-y-4">
            <LogActions />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Logs;
