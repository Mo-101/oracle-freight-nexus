
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create shipments table for canonical data
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id TEXT UNIQUE NOT NULL,
  origin_country TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  weight_kg NUMERIC NOT NULL,
  volume_cbm NUMERIC NOT NULL,
  cost NUMERIC NOT NULL,
  forwarder TEXT NOT NULL,
  transit_days INTEGER NOT NULL,
  delay_days INTEGER DEFAULT 0,
  actual_transit_days INTEGER,
  actual_cost NUMERIC,
  on_time BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forwarder performance tracking table
CREATE TABLE forwarder_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  forwarder TEXT NOT NULL,
  avg_cost_per_kg NUMERIC NOT NULL,
  avg_transit_days NUMERIC NOT NULL,
  reliability_score NUMERIC NOT NULL,
  risk_level NUMERIC NOT NULL,
  shipment_count INTEGER NOT NULL,
  on_time_rate NUMERIC NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(forwarder)
);

-- Create DeepCAL analysis results table
CREATE TABLE deepcal_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_type TEXT NOT NULL DEFAULT 'AHP-TOPSIS',
  ranking JSONB NOT NULL,
  criteria_weights JSONB NOT NULL,
  consistency_ratio NUMERIC NOT NULL,
  is_consistent BOOLEAN NOT NULL,
  analysis_report TEXT,
  data_version TEXT NOT NULL,
  forwarders_analyzed TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for performance
CREATE INDEX idx_shipments_forwarder ON shipments(forwarder);
CREATE INDEX idx_shipments_route ON shipments(origin_country, destination_country);
CREATE INDEX idx_shipments_created_at ON shipments(created_at);
CREATE INDEX idx_forwarder_performance_forwarder ON forwarder_performance(forwarder);
CREATE INDEX idx_deepcal_analyses_created_at ON deepcal_analyses(created_at);

-- Enable RLS
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forwarder_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE deepcal_analyses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on shipments" ON shipments FOR ALL USING (true);
CREATE POLICY "Allow all operations on forwarder_performance" ON forwarder_performance FOR ALL USING (true);
CREATE POLICY "Allow all operations on deepcal_analyses" ON deepcal_analyses FOR ALL USING (true);

-- Function to update forwarder performance automatically
CREATE OR REPLACE FUNCTION update_forwarder_performance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO forwarder_performance (
    forwarder,
    avg_cost_per_kg,
    avg_transit_days,
    reliability_score,
    risk_level,
    shipment_count,
    on_time_rate
  )
  SELECT 
    forwarder,
    COALESCE(AVG(cost / NULLIF(weight_kg, 0)), 0) as avg_cost_per_kg,
    AVG(transit_days) as avg_transit_days,
    CASE 
      WHEN COUNT(*) FILTER (WHERE on_time IS NOT NULL) > 0 
      THEN (COUNT(*) FILTER (WHERE on_time = true)::float / COUNT(*) FILTER (WHERE on_time IS NOT NULL) * 100)
      ELSE 50 
    END as reliability_score,
    CASE 
      WHEN COUNT(*) FILTER (WHERE on_time IS NOT NULL) > 0 
      THEN (100 - COUNT(*) FILTER (WHERE on_time = true)::float / COUNT(*) FILTER (WHERE on_time IS NOT NULL) * 100)
      ELSE 50 
    END as risk_level,
    COUNT(*) as shipment_count,
    CASE 
      WHEN COUNT(*) FILTER (WHERE on_time IS NOT NULL) > 0 
      THEN (COUNT(*) FILTER (WHERE on_time = true)::float / COUNT(*) FILTER (WHERE on_time IS NOT NULL) * 100)
      ELSE 0 
    END as on_time_rate
  FROM shipments 
  WHERE forwarder = NEW.forwarder
  GROUP BY forwarder
  ON CONFLICT (forwarder) DO UPDATE SET
    avg_cost_per_kg = EXCLUDED.avg_cost_per_kg,
    avg_transit_days = EXCLUDED.avg_transit_days,
    reliability_score = EXCLUDED.reliability_score,
    risk_level = EXCLUDED.risk_level,
    shipment_count = EXCLUDED.shipment_count,
    on_time_rate = EXCLUDED.on_time_rate,
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update forwarder performance
CREATE TRIGGER trigger_update_forwarder_performance
  AFTER INSERT OR UPDATE ON shipments
  FOR EACH ROW
  EXECUTE FUNCTION update_forwarder_performance();
