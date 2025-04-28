
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Server, Globe, FileCode, Terminal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  rules: Array<{
    action: "allow" | "deny";
    direction: "in" | "out";
    protocol: "tcp" | "udp" | "all";
    port: number;
    host: string;
  }>;
}

interface TemplatesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyTemplate: (rules: Template["rules"]) => void;
}

export function TemplatesDialog({ isOpen, onOpenChange, onApplyTemplate }: TemplatesDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const templates: Template[] = [
    {
      id: "ssh-server",
      name: "SSH Server",
      description: "Allow SSH connections on port 22",
      icon: Terminal,
      rules: [
        { action: "deny", direction: "in", protocol: "all", port: 0, host: "" },
        { action: "allow", direction: "in", protocol: "tcp", port: 22, host: "" }
      ]
    },
    {
      id: "http-server",
      name: "HTTP Server",
      description: "Allow HTTP and HTTPS connections (port 80, 443)",
      icon: Globe,
      rules: [
        { action: "deny", direction: "in", protocol: "all", port: 0, host: "" },
        { action: "allow", direction: "in", protocol: "tcp", port: 80, host: "" },
        { action: "allow", direction: "in", protocol: "tcp", port: 443, host: "" }
      ]
    },
    {
      id: "dns-server",
      name: "DNS Server",
      description: "Allow DNS queries (port 53)",
      icon: Server,
      rules: [
        { action: "deny", direction: "in", protocol: "all", port: 0, host: "" },
        { action: "allow", direction: "in", protocol: "tcp", port: 53, host: "" },
        { action: "allow", direction: "in", protocol: "udp", port: 53, host: "" }
      ]
    },
    {
      id: "block-all",
      name: "Block All",
      description: "Block all incoming connections",
      icon: Lock,
      rules: [
        { action: "deny", direction: "in", protocol: "all", port: 0, host: "" }
      ]
    },
    {
      id: "allow-all",
      name: "Allow All",
      description: "Allow all connections (not recommended)",
      icon: Unlock,
      rules: [
        { action: "allow", direction: "in", protocol: "all", port: 0, host: "" }
      ]
    }
  ];

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsConfirmDialogOpen(true);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onApplyTemplate(selectedTemplate.rules);
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Rule Templates</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Apply pre-configured rule templates to quickly set up common firewall configurations.
            </p>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{template.name}</CardTitle>
                    <template.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full"
                  >
                    Apply Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Template: {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>This will apply the following rules:</p>
            <div className="space-y-2">
              {selectedTemplate?.rules.map((rule, index) => (
                <div key={index} className="p-2 bg-secondary/20 rounded-md">
                  <p className="text-sm">
                    <span className={rule.action === 'allow' ? 'text-green-600' : 'text-red-600'}>
                      {rule.action.toUpperCase()}
                    </span>
                    {' '}{rule.direction === 'in' ? 'incoming' : 'outgoing'}{' '}
                    {rule.protocol.toUpperCase()} {rule.port === 0 ? 'all ports' : `port ${rule.port}`}
                    {rule.host ? ` from ${rule.host}` : ''}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyTemplate}>
                Apply Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
