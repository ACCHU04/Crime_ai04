export interface Person {
  id: number;
  name: string;
}

export interface Accused {
  id: number;
  case_id: number;
  accused_name: string;
  gender: string | null;
  age: number | null;
  mobile_no: string | null;
  status: string | null;
}

export interface Victim {
  id: number;
  case_id: number;
  victim_name: string;
  gender: string | null;
  age: number | null;
  occupation: string | null;
}

export interface District {
  id: number;
  district_name: string;
  state_id: number | null;
  active: boolean;
}

export interface State {
  id: number;
  name: string | null;
}

export interface Employee {
  id: number;
  first_name: string | null;
  kgid: string | null;
  district_id: number | null;
}

export interface RepeatOffender {
  accused_id: number;
  full_name: string;
  alias: string | null;
  case_count: number;
  cases: string[];
  status: string;
}
