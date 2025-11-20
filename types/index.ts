export interface Phase {
  name: string;
  description: string;
  duration_days_min: number;
  duration_days_max: number;
}

export interface ProjectTimeline {
  project_summary: string;
  phases: Phase[];
  total_duration_days_min: number;
  total_duration_days_max: number;
  assumptions: string[];
  risk_factors: string[];
}

export interface Job {
  id: string;
  file_url: string;
  timeline_json: ProjectTimeline | null;
  created_at: string;
}

export interface BusinessRules {
  phase_defaults: {
    [key: string]: [number, number];
  };
  mapping_logic: string;
  terminology: string;
}
