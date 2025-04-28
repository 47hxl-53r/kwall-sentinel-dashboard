
import { toast } from "sonner";

// API base URL - When using Vite's proxy, we can use relative URLs
const API_BASE_URL = "/api";

// API response interface
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data?: T;
  user?: string; // Added user field to match server response
}

// API error interface
export interface ApiError {
  status: number;
  message: string;
}

// Log interfaces
export interface LogEntry {
  timestamp: string;
  timestamp_ns: number;
  src_ip: string;
  dst_ip: string;
  src_port: number;
  dst_port: number;
  protocol: string;
  length: number;
  action: "ALLOW" | "DENY";
  reason: string;
}

export interface RealtimeLogsResponse {
  logs: LogEntry[];
  count: number;
  server_logs_included: boolean;
  total_logs_available: number;
}

export interface BlockedLogsResponse {
  blocked_requests: LogEntry[];
  total_blocked: number;
}

export interface LogStats {
  stats: {
    allowed: number;
    blocked: number;
    blocked_details: Array<{
      reason: string;
      count: number;
    }>;
  };
  chart_data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string[];
    }>;
  };
}

export interface ClearLogsResponse {
  status: string;
  results: {
    realtime_cleared: boolean;
    blocked_cleared: boolean;
    stats_cleared: boolean;
    db_stats_cleared: boolean;
  };
  message: string;
}

// Comprehensive fetch options for all API calls
const fetchOptions: RequestInit = {
  credentials: "include", // Include cookies for session-based auth
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
};

/**
 * Generic API fetch function with enhanced error handling
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

    // Use relative URLs with the proxy
    const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
    
    // Handle unauthorized
    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }

    // Handle 404 and other status errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP error ${response.status}: ${response.statusText}` 
      }));
      
      throw {
        status: response.status,
        message: errorData.message || "An unknown error occurred",
      };
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    
    // Format error for display and re-throwing
    const apiError = error as ApiError;
    
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
  return apiFetch<{ rules: any[] }>("/rules");
}

export async function getNextRuleId() {
  return apiFetch<{ rule_id: number }>("/rules/next_rule_id");
}

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

export async function deleteRule(ruleId: number) {
  return apiFetch<ApiResponse<any>>(`/delete/${ruleId}`, {
    method: "DELETE",
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
  return apiFetch<RealtimeLogsResponse>(`/logs/realtime?limit=${limit}&srv=${includeSrv}`);
}

export async function getBlockedLogs(limit: number = 100) {
  return apiFetch<BlockedLogsResponse>(`/logs/blocked?limit=${limit}`);
}

export async function getLogStats() {
  return apiFetch<LogStats>("/logs/stats");
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
  
  return apiFetch<ClearLogsResponse>(`/logs/clear?${params.toString()}`, {
    method: "DELETE",
  });
}
