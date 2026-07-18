export const ROUTES = {
  DASHBOARD: "/dashboard",
  INVESTIGATION: "/investigation",
  ANALYTICS: "/analytics",
  NETWORK: "/network",
  COPILOT: "/copilot",
  SETTINGS: "/settings",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
