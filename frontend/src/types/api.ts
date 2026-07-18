export interface APIResponse<T> {
  success: boolean;
  data: T;
  count: number;
  generated_at: string;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface HealthResponse {
  status: "healthy" | "unhealthy";
  database: "connected" | "disconnected";
  version: string;
  timestamp: string;
  checks: {
    api: string;
    database: string;
  };
}
