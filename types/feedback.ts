export interface ActualTimeline {
  job_id: string;
  estimated_timeline: any; // Original AI-generated timeline
  actual_durations: {
    phase_name: string;
    estimated_min: number;
    estimated_max: number;
    actual_days: number;
    variance_percentage: number;
    notes?: string; // e.g., "Delayed due to material shortage"
  }[];
  actual_total_days: number;
  completion_date: string;
  project_size_m2?: number;
  accuracy_score: number; // 0-100, how close was the estimate
  learnings: string[]; // What could improve future estimates
}

export interface FeedbackMetrics {
  company_id: string;
  total_projects_tracked: number;
  average_accuracy_score: number;
  phase_accuracy: {
    phase_name: string;
    average_variance_percentage: number;
    total_samples: number;
  }[];
  common_variance_factors: {
    factor: string; // e.g., "Upper floor access"
    average_impact_days: number;
    frequency: number;
  }[];
  recommendations: string[]; // AI-generated suggestions to improve rules
}
