
// Model Request/Response Types for FastAPI Integration
export interface ShipmentFeatures {
  destination_latitude: number;
  destination_longitude: number;
  destination_country_enc: number;
  carrier_enc: number;
  weight_kg: number;
  volume_cbm: number;
  cargo_type_enc: number;
  origin_country_enc: number;
  urgency_level: number;
  seasonal_factor: number;
}

export interface ModelPrediction {
  mode_of_shipment: string;
  risk_cluster: number;
  predicted_transit_days: number;
  predicted_cost_usd: number;
  reliability_score: number;
  confidence: number;
}

export interface SHAPExplanation {
  feature_names: string[];
  feature_values: number[];
  feature_importance: number[];
  base_value: number;
  prediction_value: number;
}

export interface ModelResponse {
  mode_of_shipment: string;
  risk_cluster: number;
  predicted_transit_days: number;
  predicted_cost_usd: number;
  reliability_score: number;
  confidence: number;
  feature_importance: number[][];
  shap_explanation: SHAPExplanation;
  raw_context: ShipmentFeatures;
}

export interface ModelAPIError {
  detail: string;
  error_code: string;
  timestamp: string;
}

export interface ForwarderPrediction {
  forwarder: string;
  prediction: ModelPrediction;
  shap_explanation: SHAPExplanation;
}

export interface EnhancedForwarderRanking {
  name: string;
  transitDays: number;
  cost: number;
  risk: number;
  score: number;
  rank: number;
  mlPrediction?: ModelPrediction;
  confidence?: number;
  shapExplanation?: SHAPExplanation;
  predictionSource: 'ml_model' | 'heuristic' | 'hybrid';
}
