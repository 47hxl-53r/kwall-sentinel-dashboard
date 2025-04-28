
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { LucideIcon } from "lucide-react";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { manageConfig } from "@/services/api";
import { toast } from "sonner";

interface ConfigModeToggleProps {
  name: "lockdown" | "stealth";
  icon: LucideIcon;
  title: string;
  description: string;
  enableMessage: string;
  disableMessage: string;
  isEnabled: boolean;
  iconClassName?: string;
  onStatusChange: (status: boolean) => void;
}

export const ConfigModeToggle = ({
  name,
  icon: Icon,
  title,
  description,
  enableMessage,
  disableMessage,
  isEnabled,
  iconClassName = "",
  onStatusChange,
}: ConfigModeToggleProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingState, setPendingState] = useState(false);
  
  const handleToggleClick = (enabled: boolean) => {
    setPendingState(enabled);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await manageConfig(name, pendingState ? "on" : "off");
      onStatusChange(pendingState);
      toast.success(`${title} ${pendingState ? 'enabled' : 'disabled'}`);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(`Failed to update ${name} mode`);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b last:border-b-0 pb-4 last:pb-0">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconClassName}`} />
          <div>
            <div className="font-medium text-lg">{title}</div>
            <div className="text-sm text-muted-foreground">
              {description}
            </div>
          </div>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={handleToggleClick}
          className={isEnabled && name === "lockdown" ? "bg-deny" : ""}
        />
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title={`${pendingState ? "Enable" : "Disable"} ${title}`}
        description={pendingState ? enableMessage : disableMessage}
        icon={<Icon className={`h-5 w-5 ${iconClassName}`} />}
        onConfirm={handleConfirm}
      />
    </>
  );
};
