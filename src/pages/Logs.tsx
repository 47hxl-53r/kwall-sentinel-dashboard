
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Logs = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Log Analysis</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Logs Management</CardTitle>
            <CardDescription>
              View and analyze system logs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Coming Soon</AlertTitle>
              <AlertDescription>
                The logs management functionality is currently under development. Check back later for features including:
                <ul className="list-disc ml-6 mt-2">
                  <li>Real-time log monitoring</li>
                  <li>Blocked traffic analysis</li>
                  <li>Usage statistics and visualizations</li>
                  <li>Log search and filtering</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end">
              <Button variant="outline" disabled>
                View Available Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Logs;
