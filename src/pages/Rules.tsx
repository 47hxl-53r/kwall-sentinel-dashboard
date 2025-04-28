
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RuleTable } from "@/components/rules/RuleTable";
import { RuleForm } from "@/components/rules/RuleForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRules, manageRule } from "@/services/api";
import { toast } from "sonner";

interface Rule {
  id: string;
  action: "allow" | "deny";
  direction: "inbound" | "outbound";
  protocol: "tcp" | "udp" | "all";
  port: number;
  host: string;
}

const Rules = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const queryClient = useQueryClient();

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['rules'],
    queryFn: async () => {
      const response = await getRules();
      return response.data || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async (variables: { operation: "add" | "update" | "delete"; rule: Partial<Rule> }) => {
      return manageRule(variables.operation, variables.rule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      setIsDialogOpen(false);
      setEditingRule(null);
      toast.success(editingRule ? "Rule updated successfully" : "Rule added successfully");
    },
    onError: (error) => {
      toast.error("Failed to save rule");
    },
  });

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    mutation.mutate({ operation: "delete", rule: { id } });
  };

  const handleSubmit = async (data: Omit<Rule, "id">) => {
    const operation = editingRule ? "update" : "add";
    const rule = editingRule ? { ...data, id: editingRule.id } : data;
    mutation.mutate({ operation, rule });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Rule Management</h2>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Rule
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <RuleTable
            rules={rules}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRule ? "Edit Rule" : "Add New Rule"}
              </DialogTitle>
            </DialogHeader>
            <RuleForm
              initialData={editingRule || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Rules;
