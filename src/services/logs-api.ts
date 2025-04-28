
import { apiFetch, ApiResponse, LogEntry, RealtimeLogsResponse, BlockedLogsResponse, LogStats, ClearLogsResponse } from "./api";

/**
 * Retrieves real-time logs from the server
 * 
 * @param limit Number of logs to retrieve (default: 100)
 * @param includeSrv Include server logs (default: false)
 */
export async function getRealtimeLogs(limit: number = 100, includeSrv: boolean = false): Promise<RealtimeLogsResponse> {
  return apiFetch<RealtimeLogsResponse>(`/logs/realtime?limit=${limit}&srv=${includeSrv}`);
}

/**
 * Retrieves blocked traffic logs
 * 
 * @param limit Number of logs to retrieve (default: 100)
 */
export async function getBlockedLogs(limit: number = 100): Promise<BlockedLogsResponse> {
  return apiFetch<BlockedLogsResponse>(`/logs/blocked?limit=${limit}`);
}

/**
 * Retrieves log statistics
 */
export async function getLogStats(): Promise<LogStats> {
  return apiFetch<LogStats>("/logs/stats");
}

/**
 * Clears logs based on provided options
 * 
 * @param options Options specifying which logs to clear
 */
export async function clearLogs(options: { 
  clearRealtime?: boolean; 
  clearBlocked?: boolean; 
  clearStats?: boolean;
}): Promise<ClearLogsResponse> {
  const params = new URLSearchParams();
  if (options.clearRealtime) params.append("clear_realtime", "true");
  if (options.clearBlocked) params.append("clear_blocked", "true");
  if (options.clearStats) params.append("clear_stats", "true");
  
  return apiFetch<ClearLogsResponse>(`/logs/clear?${params.toString()}`, {
    method: "DELETE",
  });
}
