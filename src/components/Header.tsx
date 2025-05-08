
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Bell, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

export function Header() {
  const { user, logout } = useAuth();
  const [alertCount] = useState(1); // Set notification count to 1
  const [lastLoginTime] = useState(new Date()); // Current time as the login time

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-display font-bold hidden md:block">KWall</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {alertCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-deny">
                    {alertCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="border-b border-border p-3">
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              <div className="p-3">
                <div className="flex items-start gap-3 py-2 border-b border-border pb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">Someone just logged in</p>
                    <p className="text-xs text-muted-foreground">
                      {format(lastLoginTime, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="py-2 text-center">
                  <p className="text-xs text-muted-foreground">
                    No more notifications
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <div className="text-sm opacity-80">Logged in as</div>
          <div className="font-bold text-primary">{user?.username || "Admin"}</div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => logout()}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
