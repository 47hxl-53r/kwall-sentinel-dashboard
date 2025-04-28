
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, PieChart } from "recharts";

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string[];
  }>;
}

interface TrafficChartsProps {
  chartData?: ChartData;
}

export function TrafficCharts({ chartData }: TrafficChartsProps) {
  if (!chartData) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Block Reasons</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Extract data for the charts
  const trafficDistributionData = {
    labels: chartData.labels.slice(0, 2),
    datasets: [
      {
        label: chartData.datasets[0].label,
        data: chartData.datasets[0].data.slice(0, 2),
        backgroundColor: chartData.datasets[0].backgroundColor.slice(0, 2),
      },
    ],
  };
  
  const blockReasonsData = {
    labels: chartData.labels.slice(2),
    datasets: [
      {
        label: 'Block Reasons',
        data: chartData.datasets[1].data.slice(2),
        backgroundColor: chartData.datasets[1].backgroundColor.slice(2),
      },
    ],
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Traffic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer 
            config={{}} 
            className="h-[300px]"
          >
            <PieChart width={400} height={300}>
              {/* PieChart implementation would go here */}
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Block Reasons</CardTitle>
        </CardHeader>
        <CardContent>
          {blockReasonsData.labels.length > 0 ? (
            <ChartContainer 
              config={{}} 
              className="h-[300px]"
            >
              <BarChart width={400} height={300}>
                {/* BarChart implementation would go here */}
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">No blocked traffic</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
