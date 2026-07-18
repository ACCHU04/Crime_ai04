export interface Case {
  id: number;
  fir_number: string;
  crime_head_id: number | null;
  crime_subhead_id: number | null;
  district_id: number;
  unit_id: number | null;
  investigating_officer_id: number | null;
  case_category_id: number | null;
  case_status_id: number | null;
  gravity_id: number | null;
  occurrence_date: string | null;
  fir_date: string | null;
  latitude: number | null;
  longitude: number | null;
  brief_facts: string | null;
}

export interface CaseCreate {
  fir_number: string;
  crime_head_id: number;
  crime_subhead_id: number;
  district_id: number;
  unit_id: number;
  investigating_officer_id: number;
  case_category_id: number;
  case_status_id?: number;
  gravity_id: number;
  occurrence_date?: string | null;
  fir_date?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  brief_facts?: string | null;
}

export interface CaseUpdate {
  crime_head_id?: number;
  crime_subhead_id?: number;
  investigating_officer_id?: number;
  case_status_id?: number;
  occurrence_date?: string | null;
  brief_facts?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface AccusedByCaseResponse {
  case_id: number;
  fir_number: string;
  accused: {
    accused_id: number;
    accused_name: string;
    status: string | null;
  }[];
}

export interface AccusedSearchResult {
  accused_id: number;
  accused_name: string;
  case_id: number;
  status: string | null;
}

export type CaseStatusName =
  | "Under Investigation"
  | "Chargesheet Filed"
  | "Closed"
  | "Pending Trial"
  | "Convicted"
  | "Acquitted";
