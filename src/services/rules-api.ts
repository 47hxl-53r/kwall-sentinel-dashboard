
import { apiFetch, ApiResponse } from "./api";

/**
 * Gets the current firewall rules
 */
export async function getRules() {
  return apiFetch<{ rules: any[] }>("/rules");
}

/**
 * Gets the next available rule ID
 */
export async function getNextRuleId() {
  return apiFetch<{ rule_id: number }>("/rules/next_rule_id");
}

/**
 * Adds or updates a firewall rule
 * 
 * @param operation Operation to perform ("add" or "update")
 * @param ruleData Rule data
 */
export async function manageRule(operation: "add" | "update", ruleData: any) {
  return apiFetch<ApiResponse<any>>("/manage", {
    method: "POST",
    body: JSON.stringify({
      rule: {
        operation,
        ...ruleData,
      },
    }),
  });
}

/**
 * Deletes a firewall rule
 * 
 * @param ruleId ID of the rule to delete
 */
export async function deleteRule(ruleId: number) {
  return apiFetch<ApiResponse<any>>(`/delete/${ruleId}`, {
    method: "DELETE",
  });
}
