
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { AlertTriangle, ShieldAlert, Zap, RefreshCw } from "lucide-react";
import { clearLogs, manageConfig, getConfig } from "@/services/api";
import { toast } from "sonner";

export function QuickActions() {
  const [lockdownMode, setLockdownMode] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Fetch current configuration on component mount
  useEffect(() => {
    const fetchStealthStatus = async () => {
      try {
        const stealthConfig = await getConfig("stealth");
        if (stealthConfig.data && stealthConfig.data.status) {
          setStealthMode(stealthConfig.data.status === "on");
        }
      } catch (error) {
        console.error("Error fetching stealth mode status:", error);
      }
    };

    const fetchLockdownStatus = async () => {
      try {
        const lockdownConfig = await getConfig("lockdown");
        if (lockdownConfig.data && lockdownConfig.data.status) {
          setLockdownMode(lockdownConfig.data.status === "on");
        }
      } catch (error) {
        console.error("Error fetching lockdown mode status:", error);
      }
    };

    fetchStealthStatus();
    fetchLockdownStatus();
  }, []);

  const handleLockdownToggle = async (enabled: boolean) => {
    setLockdownMode(enabled);
    try {
      await manageConfig("lockdown", enabled ? "on" : "off");
      toast.success(`Lockdown mode ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      setLockdownMode(!enabled); // Revert on failure
      toast.error("Failed to update lockdown mode");
    }
  };

  const handleStealthToggle = async (enabled: boolean) => {
    setStealthMode(enabled);
    try {
      await manageConfig("stealth", enabled ? "on" : "off");
      toast.success(`Stealth mode ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      setStealthMode(!enabled); // Revert on failure
      toast.error("Failed to update stealth mode");
    }
  };

  const handleClearLogs = async () => {
    setIsClearing(true);
    try {
      const result = await clearLogs({
        clearRealtime: true,
        clearBlocked: true,
        clearStats: true
      });
      
      if (result.status === "success") {
        toast.success("All logs cleared successfully");
      } else {
        toast.warning("Some logs may not have been cleared");
      }
    } catch (error) {
      toast.error("Failed to clear logs");
    } finally {
      setIsClearing(false);
    }
  };

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
              onCheckedChange={handleLockdownToggle}
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
            <Switch checked={stealthMode} onCheckedChange={handleStealthToggle} />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Firewall Rules
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-deny border-deny hover:bg-deny/10"
              onClick={handleClearLogs}
              disabled={isClearing}
            >
              <Zap className="mr-2 h-4 w-4" />
              {isClearing ? "Clearing..." : "Clear All Logs"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
