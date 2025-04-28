
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { AlertTriangle, ShieldAlert, Zap, RefreshCw } from "lucide-react";

export function QuickActions() {
  const [lockdownMode, setLockdownMode] = useState(false);
  const [stealthMode, setStealthMode] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-deny" />
              <div>
                <div className="font-medium">Lockdown Mode</div>
                <div className="text-xs text-muted-foreground">Block all non-essential traffic</div>
              </div>
            </div>
            <Switch
              checked={lockdownMode}
              onCheckedChange={setLockdownMode}
              className={lockdownMode ? "bg-deny" : ""}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-secondary" />
              <div>
                <div className="font-medium">Stealth Mode</div>
                <div className="text-xs text-muted-foreground">Don't respond to port scans</div>
              </div>
            </div>
            <Switch checked={stealthMode} onCheckedChange={setStealthMode} />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Firewall Rules
            </Button>
            <Button variant="outline" className="w-full text-deny border-deny hover:bg-deny/10">
              <Zap className="mr-2 h-4 w-4" />
              Clear All Logs
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
