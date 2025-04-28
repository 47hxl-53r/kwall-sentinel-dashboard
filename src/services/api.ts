
import { toast } from "sonner";

// Re-export specific APIs
export * from "./logs-api";
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
