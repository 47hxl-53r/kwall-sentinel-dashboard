
import { toast } from "sonner";

// API base URL - would be configurable in production
const API_BASE_URL = "http://localhost:9876/api";

// API response interface
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data?: T;
}

// API error interface
export interface ApiError {
  status: number;
  message: string;
}

// Fetch options with credentials
const fetchOptions: RequestInit = {
  credentials: "include", // Include cookies for session-based auth
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Generic API fetch function with error handling
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const mergedOptions = {
      ...fetchOptions,
      ...options,
      headers: {
        ...fetchOptions.headers,
        ...(options.headers || {}),
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);

    // Handle unauthorized
    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || "An unknown error occurred",
      };
    }

    return data;
  } catch (error) {
    const apiError = error as ApiError;
    console.error("API Error:", apiError);
    
    // Show toast notification for errors
    toast.error(apiError.message || "Failed to connect to server");
    
    throw apiError;
  }
}

/**
 * API Functions for each endpoint
 */

// Rules
export async function getRules() {
  return apiFetch<ApiResponse<any[]>>("/rules");
}

export async function manageRule(operation: "add" | "update" | "delete", rule: any) {
  return apiFetch<ApiResponse<any>>("/manage", {
    method: "POST",
    body: JSON.stringify({
      rule: {
        operation,
        ...rule,
      },
    }),
  });
}

// Whitelist
export async function getWhitelist() {
  return apiFetch<ApiResponse<any[]>>("/whitelist");
}

export async function manageWhitelist(operation: "add" | "remove", ip_address: string) {
  return apiFetch<ApiResponse<any>>("/whitelist/manage", {
    method: "POST",
    body: JSON.stringify({
      operation,
      ip_address,
    }),
  });
}

// Configuration
export async function getConfig(type: "lockdown" | "stealth") {
  return apiFetch<ApiResponse<any>>(`/config/${type}`);
}

export async function manageConfig(type: "lockdown" | "stealth", status: "on" | "off") {
  return apiFetch<ApiResponse<any>>("/manage", {
    method: "POST",
    body: JSON.stringify({
      config: {
        [type]: status,
      },
    }),
  });
}

// Logs
export async function getRealtimeLogs(limit: number = 100, includeSrv: boolean = false) {
  return apiFetch<ApiResponse<any>>(`/logs/realtime?limit=${limit}&srv=${includeSrv}`);
}

export async function getBlockedLogs(limit: number = 100) {
  return apiFetch<ApiResponse<any>>(`/logs/blocked?limit=${limit}`);
}

export async function getLogStats() {
  return apiFetch<ApiResponse<any>>("/logs/stats");
}

export async function clearLogs(options: { 
  clearRealtime?: boolean; 
  clearBlocked?: boolean; 
  clearStats?: boolean;
}) {
  const params = new URLSearchParams();
  if (options.clearRealtime) params.append("clear_realtime", "true");
  if (options.clearBlocked) params.append("clear_blocked", "true");
  if (options.clearStats) params.append("clear_stats", "true");
  
  return apiFetch<ApiResponse<any>>(`/logs/clear?${params.toString()}`, {
    method: "DELETE",
  });
}
