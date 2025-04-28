
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ConfirmationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  onConfirm: () => Promise<void>;
  variant?: "destructive" | "default";
}

export const ConfirmationDialog = ({
  isOpen,
  setIsOpen,
  title,
  description,
  icon,
  onConfirm,
  variant = "default"
}: ConfirmationDialogProps) => {
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = async () => {
    if (confirmText.toLowerCase() !== "yes") {
      toast.error("Please type 'yes' to confirm the change");
      return;
    }
    await onConfirm();
    setConfirmText("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="confirm-action" className="mb-2 block">
            Type "yes" to confirm this action:
          </Label>
          <Input
            id="confirm-action"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type 'yes' to confirm"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
