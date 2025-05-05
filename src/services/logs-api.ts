
import { apiFetch } from "./api";

export interface Log {
  id?: number;
  timestamp: string;
  timestamp_ns?: number;
  src_ip: string;
  dst_ip: string;
  src_port: number;
  dst_port: number;
  protocol: string;
  length: number;
  action: "ALLOW" | "DENY";
  reason: string;
}

export interface LogsFilter {
  limit?: number;
  offset?: number;
  action?: "ALLOW" | "DENY";
  protocol?: "TCP" | "UDP" | "ICMP";
  src_ip?: string;
  dst_ip?: string;
  min_port?: number;
  max_port?: number;
  date_from?: string;
  date_to?: string;
  srv?: boolean;
}

export interface LogsResponse {
  logs: Log[];
  total: number;
  limit: number;
  offset: number;
  server_logs_included: boolean;
  filters: LogsFilter;
}

export interface RealtimeLogsResponse {
  logs: Log[];
  count: number;
  server_logs_included: boolean;
  total_logs_available: number;
}

export interface BlockedLogsResponse {
  logs: Log[];
  total: number;
  limit: number;
}

/**
 * Gets all logs from the database with optional filtering
 */
export async function getAllLogs(filters: LogsFilter = {}): Promise<LogsResponse> {
  // Build query string from filters
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<LogsResponse>(`/logs/all${queryString}`);
}

/**
 * Gets real-time logs
 */
export async function getRealtimeLogs(limit: number = 100, srv: boolean = false): Promise<RealtimeLogsResponse> {
  return apiFetch<RealtimeLogsResponse>(`/logs/realtime?limit=${limit}&srv=${srv}`);
}

/**
 * Gets blocked logs
 */
export async function getBlockedLogs(limit: number = 100): Promise<BlockedLogsResponse> {
  return apiFetch<BlockedLogsResponse>(`/logs/blocked?limit=${limit}`);
}
