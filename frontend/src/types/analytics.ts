export interface DashboardStats {
  total_cases: number;
  pending_cases: number;
  closed_cases: number;
  convicted_cases: number;
  top_district: string | null;
  top_crime_type: string | null;
}

export interface HotspotEntry {
  district: string;
  latitude: number | null;
  longitude: number | null;
  case_count: number;
}

export interface MonthlyTrend {
  month: string;
  count: number;
}

export interface PendingCase {
  case_id: number;
  case_number: string;
  title: string;
  crime_type: string;
  district: string;
  status: string;
  incident_date: string | null;
  days_pending: number;
}

export interface CrimeTypeSummary {
  crime_type: string;
  count: number;
}

export interface StatusSummary {
  status: string;
  count: number;
}

export interface DistrictSummary {
  district: string;
  count: number;
}
