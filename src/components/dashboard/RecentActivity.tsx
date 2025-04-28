
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { getRealtimeLogs } from "@/services/api";
import { Loader2 } from "lucide-react";

function getProtocolIcon(protocol: string) {
  switch (protocol) {
    case "TCP":
    case "6":
    case "2":
      return "🔒";
    case "UDP":
    case "17":
      return "🛡️";
    case "ICMP":
    case "1":
      return "⚠️";
    default:
      return "📡";
  }
}

export function RecentActivity() {
  const { data, isLoading } = useQuery({
    queryKey: ["realtimeLogs", 5, false],
    queryFn: () => getRealtimeLogs(5, false),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return timestamp;
    }
  };

  const getProtocolDisplay = (protocol: string) => {
    const protocolMap: Record<string, string> = {
      "1": "ICMP",
      "2": "TCP",
      "6": "TCP",
      "17": "UDP",
    };
    return protocolMap[protocol] || protocol;
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] rounded-md">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : data?.logs && data.logs.length > 0 ? (
            <div className="space-y-2">
              {data.logs.map((log, index) => (
                <div key={`${log.timestamp_ns}-${index}`} className="log-row p-3 text-xs">
                  <div className="flex justify-between mb-1">
                    <div className="font-mono text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                    </div>
                    <Badge
                      variant="outline"
                      className={log.action === "ALLOW" ? "border-allow text-allow" : "border-deny text-deny"}
                    >
                      {log.action}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="protocol-icon">{getProtocolIcon(log.protocol)}</span> {getProtocolDisplay(log.protocol)}
                    </div>
                    <div className="font-mono">
                      {log.src_ip}:{log.src_port} → {log.dst_ip}:{log.dst_port}
                    </div>
                  </div>
                  <div className="mt-1 text-muted-foreground">{log.reason}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              No recent activity
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
