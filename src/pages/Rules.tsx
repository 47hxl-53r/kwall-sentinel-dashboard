
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RuleTable } from "@/components/rules/RuleTable";
import { RuleForm } from "@/components/rules/RuleForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRules, manageRule, getNextRuleId } from "@/services/api";
import { toast } from "sonner";

interface Rule {
  rule_id: number;
  action: "allow" | "deny";
  direction: "in" | "out";
  protocol: "tcp" | "udp" | "all";
  port: number;
  host: string;
  created_at?: string;
  updated_at?: string;
}

const Rules = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const queryClient = useQueryClient();

  const { data: rulesData = { rules: [] }, isLoading } = useQuery({
    queryKey: ['rules'],
    queryFn: getRules,
  });

  const rules = rulesData.rules || [];

  const mutation = useMutation({
    mutationFn: async (variables: { 
      operation: "add" | "update" | "delete"; 
      ruleData: Partial<Rule>
    }) => {
      return manageRule(variables.operation, variables.ruleData);
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

  const nextRuleIdQuery = useQuery({
    queryKey: ['nextRuleId'],
    queryFn: getNextRuleId,
    enabled: false, // Don't run this query automatically
  });

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  const handleDelete = async (rule_id: number) => {
    mutation.mutate({ 
      operation: "delete", 
      ruleData: { rule_id } 
    });
  };

  const handleSubmit = async (data: Omit<Rule, "created_at" | "updated_at">) => {
    const operation = editingRule ? "update" : "add";
    let ruleData = { ...data };
    
    // If adding a new rule, get the next rule_id
    if (operation === "add") {
      try {
        const response = await nextRuleIdQuery.refetch();
        if (response.data) {
          ruleData.rule_id = response.data.rule_id;
        }
      } catch (error) {
        toast.error("Failed to get next rule ID");
        return;
      }
    }
    
    mutation.mutate({ 
      operation, 
      ruleData 
    });
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
