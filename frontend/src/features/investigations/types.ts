import type { Case, Victim, Accused, Employee, GraphResult } from "@/types";

export interface TimelineEvent {
  date: string;
  type: "occurrence" | "fir" | "created" | "status";
  title: string;
}

export interface TimelineData {
  case_id: number;
  events: TimelineEvent[];
}

export interface CaseReport {
  case_id: number;
  fir_number: string;
  crime_head: string | null;
  crime_subhead: string | null;
  status: string | null;
  district: string | null;
  victim_name: string | null;
  accused_name: string | null;
  investigating_officer: string | null;
  occurrence_date: string | null;
  fir_date: string | null;
  brief_facts: string | null;
}

export interface CaseSummary {
  case_id: number;
  fir_number: string;
  crime_head: string | null;
  crime_subhead: string | null;
  status: string | null;
  district: string | null;
  summary: string;
  suggested_actions: string[];
}

export type { Case, Victim, Accused, Employee, GraphResult };
