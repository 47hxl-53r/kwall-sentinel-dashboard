
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart } from "@/components/ui/chart";

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
          <PieChart
            data={trafficDistributionData}
            height={300}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Block Reasons</CardTitle>
        </CardHeader>
        <CardContent>
          {blockReasonsData.labels.length > 0 ? (
            <BarChart
              data={blockReasonsData}
              height={300}
            />
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
