
import { toast } from "sonner";
import { apiFetch } from "./api";

export interface Log {
  id: number;
  timestamp: string;
  timestamp_ns?: number;
  src_ip: string;
  dst_ip: string;
  src_port: number;
  dst_port: number;
  protocol: "TCP" | "UDP" | "ICMP";
  length: number;
  action: "ALLOW" | "DENY";
  reason: string;
}

export interface LogsAllResponse {
  logs: Log[];
  total: number;
  limit: number;
  offset: number;
  server_logs_included: boolean;
  filters: Record<string, any>;
}

export interface LogsFilterParams {
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

export async function getAllLogs(params: LogsFilterParams = {}): Promise<LogsAllResponse> {
  const queryParams = new URLSearchParams();
  
  // Add all non-null params to the query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return apiFetch<LogsAllResponse>(`/logs/all${queryString}`);
}

export async function getRealtimeLogs(limit: number = 100, includeServerLogs: boolean = false): Promise<{
  logs: Log[];
  count: number;
  server_logs_included: boolean;
  total_logs_available: number;
}> {
  const queryParams = new URLSearchParams();
  queryParams.append('limit', String(limit));
  if (includeServerLogs) {
    queryParams.append('srv', 'true');
  }
  
  return apiFetch<{
    logs: Log[];
    count: number;
    server_logs_included: boolean;
    total_logs_available: number;
  }>(`/logs/realtime?${queryParams.toString()}`);
}

export async function getBlockedLogs(limit: number = 100): Promise<{
  logs: Log[];
  count: number;
}> {
  return apiFetch<{
    logs: Log[];
    count: number;
  }>(`/logs/blocked?limit=${limit}`);
}

export async function clearAllLogs(): Promise<{ success: boolean, message: string }> {
  return apiFetch<{ success: boolean, message: string }>('/logs/clear', {
    method: 'DELETE',
  });
}
