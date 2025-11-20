-- Table to track actual project outcomes vs. estimates
-- This enables continuous improvement of timeline accuracy

CREATE TABLE project_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  company_id TEXT NOT NULL,

  -- Original estimate
  estimated_timeline JSONB NOT NULL,
  estimated_total_min INTEGER NOT NULL,
  estimated_total_max INTEGER NOT NULL,

  -- Actual outcomes
  actual_total_days INTEGER NOT NULL,
  actual_phase_durations JSONB NOT NULL, -- Array of {phase, estimated_min, estimated_max, actual_days}
  completion_date TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Project details for analysis
  project_size_m2 DECIMAL,
  room_count INTEGER,
  floor_count INTEGER,
  project_type TEXT, -- e.g., "flat_refurb", "house_renovation", "loft_conversion"

  -- Accuracy metrics
  accuracy_score DECIMAL, -- 0-100, calculated as: 100 - (abs(actual - avg_estimate) / avg_estimate * 100)
  variance_percentage DECIMAL, -- (actual - avg_estimate) / avg_estimate * 100

  -- Learning notes
  variance_factors TEXT[], -- e.g., ["material_delay", "structural_surprise", "weather"]
  notes TEXT,
  learnings TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast company-specific queries
CREATE INDEX idx_project_feedback_company ON project_feedback(company_id);
CREATE INDEX idx_project_feedback_job ON project_feedback(job_id);
CREATE INDEX idx_project_feedback_accuracy ON project_feedback(accuracy_score);

-- Table to store aggregated learning metrics per company
CREATE TABLE company_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id TEXT UNIQUE NOT NULL,

  total_projects_tracked INTEGER DEFAULT 0,
  average_accuracy_score DECIMAL,

  -- Phase-specific accuracy
  phase_metrics JSONB, -- { phase_name: { avg_variance, total_samples, trend } }

  -- Common variance factors and their impact
  variance_factors JSONB, -- { factor_name: { avg_impact_days, frequency, trend } }

  -- AI-generated recommendations
  recommendations TEXT[],

  -- Suggested rule adjustments
  suggested_rule_changes JSONB, -- { phase_name: { current_range, suggested_range, confidence } }

  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to calculate accuracy score
CREATE OR REPLACE FUNCTION calculate_accuracy_score(
  actual_days INTEGER,
  estimated_min INTEGER,
  estimated_max INTEGER
) RETURNS DECIMAL AS $$
DECLARE
  avg_estimate DECIMAL;
  variance DECIMAL;
  accuracy DECIMAL;
BEGIN
  avg_estimate := (estimated_min + estimated_max) / 2.0;
  variance := ABS(actual_days - avg_estimate) / avg_estimate * 100;
  accuracy := GREATEST(0, 100 - variance);
  RETURN accuracy;
END;
$$ LANGUAGE plpgsql;

-- Function to update company metrics when new feedback is added
CREATE OR REPLACE FUNCTION update_company_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert company metrics
  INSERT INTO company_metrics (company_id, total_projects_tracked, average_accuracy_score)
  VALUES (
    NEW.company_id,
    1,
    NEW.accuracy_score
  )
  ON CONFLICT (company_id) DO UPDATE SET
    total_projects_tracked = company_metrics.total_projects_tracked + 1,
    average_accuracy_score = (
      company_metrics.average_accuracy_score * company_metrics.total_projects_tracked + NEW.accuracy_score
    ) / (company_metrics.total_projects_tracked + 1),
    last_updated = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update metrics
CREATE TRIGGER trigger_update_company_metrics
AFTER INSERT ON project_feedback
FOR EACH ROW
EXECUTE FUNCTION update_company_metrics();

-- View for easy analysis
CREATE VIEW project_accuracy_analysis AS
SELECT
  pf.company_id,
  pf.project_type,
  COUNT(*) as total_projects,
  AVG(pf.accuracy_score) as avg_accuracy,
  AVG(pf.variance_percentage) as avg_variance,
  AVG(pf.actual_total_days) as avg_actual_days,
  AVG((pf.estimated_total_min + pf.estimated_total_max) / 2.0) as avg_estimated_days,
  ARRAY_AGG(DISTINCT unnest(pf.variance_factors)) as common_factors
FROM project_feedback pf
GROUP BY pf.company_id, pf.project_type
ORDER BY total_projects DESC;
