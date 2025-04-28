
import { apiFetch, ApiResponse } from "./api";

/**
 * Gets the current whitelist
 */
export async function getWhitelist() {
  return apiFetch<ApiResponse<any[]>>("/whitelist");
}

/**
 * Adds or removes an IP address from the whitelist
 * 
 * @param operation Operation to perform ("add" or "remove")
 * @param ip_address IP address to manage
 */
export async function manageWhitelist(operation: "add" | "remove", ip_address: string) {
  return apiFetch<ApiResponse<any>>("/whitelist/manage", {
    method: "POST",
    body: JSON.stringify({
      operation,
      ip_address,
    }),
  });
}
