import { NeutrosophicValue } from "@/utils/neutrosophicEngine";

export interface ForwarderPerformance {
    name: string;
    avgCostPerKg: number;
    avgTransitDays: number;
    reliabilityScore: number;
    quoteWinRate: number;
}

export interface SymbolicDecision {
  recommendation: string;
  confidence: number;
  ethicsScore: number;
  dataPoints: number;
  reasoning: string[];
  uncertaintyFactors: string[];
}

export interface CanonicalShipment {
  id: number;
  date_of_collection: string;
  date_of_arrival_destination: string;
  date_of_greenlight_to_pickup: string;
  mode_of_shipment: string;
  initial_quote_awarded: number;
  final_quote_awarded_freight_forwarder_carrier: number;
  kuehne_nagel: number;
  scan_global_logistics: number;
  dhl_express: number;
  dhl_global: number;
  siginon: number;
  agl: number;
  freight_in_time: number;
  bwosi: number;
  origin: string;
  destination: string;
  cargo_type: string;
  weight_kg: number;
  volume_cbm: number;
  carrier: string;
  routing: string;
  transit_days: number;
  actual_cost: number;
  fuel_surcharge: number;
  insurance: number;
  customs_brokerage: number;
  port_handling: number;
  storage: number;
  demurrage: number;
  other_charges: number;
  total_cost: number;
  delay_days: number;
  damage: boolean;
  loss: boolean;
  customer_complaints: string;
  documentation_errors: boolean;
  communication_issues: boolean;
  payment_issues: boolean;
  shipment_status: string;
  temperature_control_failures: boolean;
  security_breaches: boolean;
  risk_assessment_score: number;
  sustainability_metrics: number;
  customer_satisfaction_score: number;
  market_volatility_impact: number;
  regulatory_compliance_issues: boolean;
  force_majeure_events: boolean;
  visibility_and_tracking_accuracy: number;
  exception_handling_effectiveness: number;
  overall_performance_score: number;
  neutrosophic_interpretation?: NeutrosophicValue;
}
