
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, X, Check } from "lucide-react";
import { getLogStats } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  isLoading?: boolean;
}

function StatCard({ title, value, description, icon: Icon, iconColor, isLoading = false }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor || "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsOverview() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["logStats"],
    queryFn: getLogStats,
    refetchInterval: 5000, // Refresh every 5 seconds
  });
  
  // Use real data when available, otherwise use placeholder values
  const blockedCount = statsData?.stats.blocked || 0;
  const allowedCount = statsData?.stats.allowed || 0;
  
  // Mock data for active rules and uptime (would normally come from an API)
  const activeRules = 24;
  const uptime = "18d 4h";
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Blocked Traffic"
        value={blockedCount.toLocaleString()}
        description="Total packets blocked"
        icon={X}
        iconColor="text-deny"
        isLoading={isLoading}
      />
      <StatCard
        title="Allowed Traffic"
        value={allowedCount.toLocaleString()}
        description="Total packets allowed"
        icon={Check}
        iconColor="text-allow"
        isLoading={isLoading}
      />
      <StatCard
        title="Active Rules"
        value={activeRules}
        description="Firewall rules in effect"
        icon={Shield}
        iconColor="text-primary"
        isLoading={false}
      />
      <StatCard
        title="Uptime"
        value={uptime}
        description="Since last kernel module restart"
        icon={Clock}
        iconColor="text-secondary"
        isLoading={false}
      />
    </div>
  );
}
