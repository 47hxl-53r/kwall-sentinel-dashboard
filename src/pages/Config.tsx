
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, ShieldAlert, Info } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getConfig, manageConfig } from "@/services/api";

const Config = () => {
  const [lockdownMode, setLockdownMode] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isLockdownDialogOpen, setIsLockdownDialogOpen] = useState(false);
  const [isStealthDialogOpen, setIsStealthDialogOpen] = useState(false);
  const [pendingLockdownState, setPendingLockdownState] = useState(false);
  const [pendingStealthState, setPendingStealthState] = useState(false);

  // Fetch current configuration on component mount
  useEffect(() => {
    const fetchModeStatuses = async () => {
      try {
        const stealthConfig = await getConfig("stealth");
        if (stealthConfig.data && stealthConfig.data.status) {
          setStealthMode(stealthConfig.data.status === "on");
        }
        
        const lockdownConfig = await getConfig("lockdown");
        if (lockdownConfig.data && lockdownConfig.data.status) {
          setLockdownMode(lockdownConfig.data.status === "on");
        }
      } catch (error) {
        console.error("Error fetching configuration status:", error);
        toast.error("Failed to load current configuration");
      }
    };

    fetchModeStatuses();
  }, []);

  const handleLockdownToggleClick = (enabled: boolean) => {
    setPendingLockdownState(enabled);
    setIsLockdownDialogOpen(true);
  };

  const handleStealthToggleClick = (enabled: boolean) => {
    setPendingStealthState(enabled);
    setIsStealthDialogOpen(true);
  };

  const confirmLockdownChange = async () => {
    if (confirmText.toLowerCase() !== "yes") {
      toast.error("Please type 'yes' to confirm the change");
      return;
    }

    try {
      await manageConfig("lockdown", pendingLockdownState ? "on" : "off");
      setLockdownMode(pendingLockdownState);
      toast.success(`Lockdown mode ${pendingLockdownState ? 'enabled' : 'disabled'}`);
      setIsLockdownDialogOpen(false);
      setConfirmText("");
    } catch (error) {
      toast.error("Failed to update lockdown mode");
    }
  };

  const confirmStealthChange = async () => {
    if (confirmText.toLowerCase() !== "yes") {
      toast.error("Please type 'yes' to confirm the change");
      return;
    }

    try {
      await manageConfig("stealth", pendingStealthState ? "on" : "off");
      setStealthMode(pendingStealthState);
      toast.success(`Stealth mode ${pendingStealthState ? 'enabled' : 'disabled'}`);
      setIsStealthDialogOpen(false);
      setConfirmText("");
    } catch (error) {
      toast.error("Failed to update stealth mode");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Configuration</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Firewall Modes</CardTitle>
            <CardDescription>
              Configure special operation modes for the firewall
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Lockdown Mode */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-deny" />
                <div>
                  <div className="font-medium text-lg">Lockdown Mode</div>
                  <div className="text-sm text-muted-foreground">
                    When enabled, blocks all non-essential traffic to and from your system.
                    Use this in emergency situations when your system might be under attack.
                  </div>
                </div>
              </div>
              <Switch
                checked={lockdownMode}
                onCheckedChange={handleLockdownToggleClick}
                className={lockdownMode ? "bg-deny" : ""}
              />
            </div>

            {/* Stealth Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-secondary" />
                <div>
                  <div className="font-medium text-lg">Stealth Mode</div>
                  <div className="text-sm text-muted-foreground">
                    When enabled, your system will not respond to port scans, making it
                    more difficult for potential attackers to discover services running on your system.
                  </div>
                </div>
              </div>
              <Switch checked={stealthMode} onCheckedChange={handleStealthToggleClick} />
            </div>
          </CardContent>
        </Card>

        {/* Lockdown Mode Dialog */}
        <Dialog open={isLockdownDialogOpen} onOpenChange={setIsLockdownDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-deny" />
                {pendingLockdownState ? "Enable" : "Disable"} Lockdown Mode
              </DialogTitle>
              <DialogDescription>
                {pendingLockdownState 
                  ? "Warning: Enabling Lockdown Mode will block all non-essential traffic to and from your system. Only critical services and connections will be allowed. This may disrupt normal operations."
                  : "Disabling Lockdown Mode will return your firewall to normal operation, allowing all traffic that doesn't violate specific rules."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="confirm-lockdown" className="mb-2 block">
                Type "yes" to confirm this action:
              </Label>
              <Input 
                id="confirm-lockdown" 
                value={confirmText} 
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type 'yes' to confirm"
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsLockdownDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant={pendingLockdownState ? "destructive" : "default"}
                onClick={confirmLockdownChange}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stealth Mode Dialog */}
        <Dialog open={isStealthDialogOpen} onOpenChange={setIsStealthDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-secondary" />
                {pendingStealthState ? "Enable" : "Disable"} Stealth Mode
              </DialogTitle>
              <DialogDescription>
                {pendingStealthState
                  ? "Enabling Stealth Mode will prevent your system from responding to port scans and similar probing techniques. This makes your system more difficult to discover on the network, increasing security but potentially affecting some network diagnostics tools."
                  : "Disabling Stealth Mode will allow your system to respond normally to port scans and network discovery. This is the standard behavior for most systems."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="confirm-stealth" className="mb-2 block">
                Type "yes" to confirm this action:
              </Label>
              <Input 
                id="confirm-stealth" 
                value={confirmText} 
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type 'yes' to confirm"
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsStealthDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmStealthChange}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Config;
