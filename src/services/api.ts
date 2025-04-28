
import { toast } from "sonner";

// Re-export specific APIs
export * from "./config-api";
export * from "./rules-api";
export * from "./whitelist-api";

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

// Log interfaces needed by dashboard components
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

export interface ClearLogsOptions {
  clearRealtime: boolean;
  clearBlocked: boolean;
  clearStats: boolean;
}

export interface ClearLogsResponse {
  status: string;
  results: {
    realtime_cleared: boolean;
    blocked_cleared: boolean;
    stats_cleared: boolean;
    db_stats_cleared: boolean;
  };
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

// Mock functions for dashboard components
export async function getLogStats(): Promise<LogStats> {
  // Return mock data for now
  return {
    stats: {
      allowed: 120,
      blocked: 45,
      blocked_details: [
        { reason: "Rate Limiting", count: 20 },
        { reason: "IP Block", count: 15 },
        { reason: "Rule Violation", count: 10 }
      ]
    },
    chart_data: {
      labels: ["Allowed", "Blocked", "Rate Limiting", "IP Block", "Rule Violation"],
      datasets: [
        {
          label: "Traffic Distribution",
          data: [120, 45, 0, 0, 0],
          backgroundColor: ["#10b981", "#ef4444", "#f59e0b", "#6366f1", "#8b5cf6"]
        },
        {
          label: "Block Reasons",
          data: [0, 0, 20, 15, 10],
          backgroundColor: ["#10b981", "#ef4444", "#f59e0b", "#6366f1", "#8b5cf6"]
        }
      ]
    }
  };
}

export async function getRealtimeLogs(limit: number = 5, includeServerLogs: boolean = false): Promise<RealtimeLogsResponse> {
  // Return mock data for now
  const mockLogs: LogEntry[] = [
    {
      timestamp: new Date().toISOString(),
      timestamp_ns: Date.now() * 1000000,
      src_ip: "192.168.1.100",
      dst_ip: "10.0.0.1",
      src_port: 45678,
      dst_port: 443,
      protocol: "TCP",
      length: 64,
      action: "ALLOW",
      reason: "Whitelist match"
    },
    {
      timestamp: new Date(Date.now() - 30000).toISOString(),
      timestamp_ns: (Date.now() - 30000) * 1000000,
      src_ip: "192.168.1.105",
      dst_ip: "10.0.0.2",
      src_port: 52123,
      dst_port: 80,
      protocol: "TCP",
      length: 128,
      action: "DENY",
      reason: "Rate limit exceeded"
    }
  ];

  return {
    logs: mockLogs.slice(0, limit),
    count: mockLogs.length,
    server_logs_included: includeServerLogs,
    total_logs_available: 2
  };
}

export async function clearLogs(options: ClearLogsOptions): Promise<ClearLogsResponse> {
  // Mock response for clearing logs
  return {
    status: "success",
    results: {
      realtime_cleared: options.clearRealtime,
      blocked_cleared: options.clearBlocked,
      stats_cleared: options.clearStats,
      db_stats_cleared: true
    }
  };
}
