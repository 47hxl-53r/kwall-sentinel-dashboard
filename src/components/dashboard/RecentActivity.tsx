
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistance } from "date-fns";

// Mock data - would be fetched from API
const recentLogs = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    src_ip: "192.168.1.105",
    dst_ip: "192.168.1.1",
    src_port: 49523,
    dst_port: 443,
    protocol: "TCP",
    length: 1240,
    action: "ALLOW",
    reason: "Matched rule #5",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    src_ip: "45.33.12.204",
    dst_ip: "192.168.1.105",
    src_port: 443,
    dst_port: 49234,
    protocol: "TCP",
    length: 520,
    action: "DENY",
    reason: "Rate limiting",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    src_ip: "192.168.1.105",
    dst_ip: "8.8.8.8",
    src_port: 53242,
    dst_port: 53,
    protocol: "UDP",
    length: 64,
    action: "ALLOW",
    reason: "Matched rule #2",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    src_ip: "192.168.1.105",
    dst_ip: "23.64.122.50",
    src_port: 49982,
    dst_port: 443,
    protocol: "TCP",
    length: 1820,
    action: "ALLOW",
    reason: "Default outbound policy",
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    src_ip: "104.28.32.85",
    dst_ip: "192.168.1.105",
    src_port: 80,
    dst_port: 58423,
    protocol: "TCP",
    length: 3240,
    action: "ALLOW",
    reason: "Matched rule #3",
  },
];

function getProtocolIcon(protocol: string) {
  switch (protocol) {
    case "TCP":
      return "🔒";
    case "UDP":
      return "🛡️";
    case "ICMP":
      return "⚠️";
    default:
      return "📡";
  }
}

export function RecentActivity() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] rounded-md">
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div key={log.id} className="log-row p-3 text-xs">
                <div className="flex justify-between mb-1">
                  <div className="font-mono text-muted-foreground">
                    {formatDistance(log.timestamp, new Date(), { addSuffix: true })}
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
                    <span className="protocol-icon">{getProtocolIcon(log.protocol)}</span> {log.protocol}
                  </div>
                  <div>
                    {log.src_ip}:{log.src_port} → {log.dst_ip}:{log.dst_port}
                  </div>
                </div>
                <div className="mt-1 text-muted-foreground">{log.reason}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
