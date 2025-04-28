
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, X, Check } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
}

function StatCard({ title, value, description, icon: Icon, iconColor }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor || "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Blocked Traffic"
        value="1,284"
        description="Total packets blocked today"
        icon={X}
        iconColor="text-deny"
      />
      <StatCard
        title="Allowed Traffic"
        value="8,741"
        description="Total packets allowed today"
        icon={Check}
        iconColor="text-allow"
      />
      <StatCard
        title="Active Rules"
        value="24"
        description="Firewall rules in effect"
        icon={Shield}
        iconColor="text-primary"
      />
      <StatCard
        title="Uptime"
        value="18d 4h"
        description="Since last kernel module restart"
        icon={Clock}
        iconColor="text-secondary"
      />
    </div>
  );
}
