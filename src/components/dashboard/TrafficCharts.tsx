
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLogStats } from "@/services/api";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

export function TrafficCharts() {
  const { data: statsData, isLoading, isError } = useQuery({
    queryKey: ["logStats"],
    queryFn: getLogStats,
    refetchInterval: 5000, // Refresh every 5 seconds
  });
  
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Traffic Composition</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Block Reasons</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isError || !statsData) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Traffic Composition</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <p className="text-destructive">Failed to load data</p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Block Reasons</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <p className="text-destructive">Failed to load data</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Create data for the traffic pie chart
  const trafficData = [
    { name: "Allowed", value: statsData.stats.allowed, color: statsData.chart_data.datasets[0].backgroundColor[0] },
    { name: "Blocked", value: statsData.stats.blocked, color: statsData.chart_data.datasets[0].backgroundColor[1] },
  ];

  // Create data for the block reasons chart
  const blockReasonsData = statsData.stats.blocked_details.map((detail, index) => ({
    name: detail.reason,
    value: detail.count,
    color: statsData.chart_data.datasets[1].backgroundColor[index % statsData.chart_data.datasets[1].backgroundColor.length],
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Traffic Composition</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} packets`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Block Reasons</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="h-[300px]">
            {blockReasonsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={blockReasonsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip formatter={(value) => [`${value} packets`, ""]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {blockReasonsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No blocked traffic data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
