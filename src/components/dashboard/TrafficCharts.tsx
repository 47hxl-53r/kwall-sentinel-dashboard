
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState } from "react";

// Mock data - would be replaced with API data
const trafficData = [
  { name: "Allowed", value: 8741, color: "hsl(var(--allow))" },
  { name: "Blocked", value: 1284, color: "hsl(var(--deny))" },
];

const blockReasonsData = [
  { name: "Rate limiting", value: 524, color: "#f72585" },
  { name: "Invalid packet", value: 318, color: "#b5179e" },
  { name: "Blacklisted IP", value: 204, color: "#7209b7" },
  { name: "Port scan", value: 162, color: "#560bad" },
  { name: "Other", value: 76, color: "#480ca8" },
];

const packetRateData = Array.from({ length: 60 }, (_, i) => ({
  time: i,
  packets: Math.floor(Math.random() * 100) + 50,
  bytes: (Math.floor(Math.random() * 100) + 50) * 1024,
}));

export function TrafficCharts() {
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
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Live Packet Rate (60s)</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={packetRateData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" label={{ value: "Seconds ago", position: "insideBottomRight", offset: -10 }} />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary))" />
                <Tooltip formatter={(value, name) => [name === "packets" ? `${value} packets` : `${Math.round(Number(value) / 1024).toFixed(2)} KB`, ""]} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="packets" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} name="Packets" />
                <Line yAxisId="right" type="monotone" dataKey="bytes" stroke="hsl(var(--secondary))" name="Bytes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
