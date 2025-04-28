
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "sonner";

interface Rule {
  id: string;
  action: "allow" | "deny";
  direction: "inbound" | "outbound";
  protocol: "tcp" | "udp" | "all";
  port: number;
  host: string;
}

export function RuleTable({ rules, onEdit, onDelete }: { 
  rules: Rule[];
  onEdit: (rule: Rule) => void;
  onDelete: (id: string) => void;
}) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      onDelete(id);
      toast.success("Rule deleted successfully");
    } catch (error) {
      toast.error("Failed to delete rule");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Protocol</TableHead>
            <TableHead>Port</TableHead>
            <TableHead>Host</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className={rule.action === 'allow' ? 'text-allow' : 'text-deny'}>
                {rule.action}
              </TableCell>
              <TableCell>{rule.direction}</TableCell>
              <TableCell>{rule.protocol}</TableCell>
              <TableCell>{rule.port}</TableCell>
              <TableCell>{rule.host}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(rule)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(rule.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
