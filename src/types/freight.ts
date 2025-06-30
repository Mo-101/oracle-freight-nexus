
import { NeutrosophicValue } from "@/utils/neutrosophicEngine";

export type TransportMode = 'Air' | 'Sea' | 'Road' | 'Rail' | 'Multimodal';

export interface ForwarderPerformance {
    name: string;
    avgCostPerKg: number;
    avgTransitDays: number;
    reliabilityScore: number;
    quoteWinRate: number;
    totalShipments: number;
    onTimeRate: number;
}

export interface RealTimeRate {
    baseRate: number;
    fuelSurcharge: number;
    securityFee: number;
    handlingFee: number;
    customsFee: number;
    insuranceRate: number;
    totalRate: number;
    validUntil: string;
    currency: string;
}

export interface ForwarderIntelligence {
    name: string;
    avgCostPerKg: number;
    avgTransitDays: number;
    reliabilityScore: number;
    totalShipments: number;
    emergencyGrade: 'Standard' | 'Priority' | 'Critical';
    quoteCoverage: number;
    specializations: string[];
    recentPerformance: Array<{
        month: string;
        shipmentsHandled: number;
        successRate: number;
        avgCost: number;
    }>;
    successRate: number;
    realTimeRate?: RealTimeRate;
    dynamicScore?: number;
    rankPosition?: number;
}

export interface RouteOption {
    mode: TransportMode;
    corridor: string;
    distanceKm: number;
    transitTimeDays: number;
    riskFactor: number;
    confidence: number;
    emissionScore: number;
    avgCost: number;
    historicalShipments: number;
    successRate: number;
}

export interface CorridorIntelligence {
    origin: string;
    destination: string;
    totalShipments: number;
    successRate: number;
    avgTransitDays: number;
    predominantMode: TransportMode;
    riskFactors: string[];
    seasonalVariation: number;
}

export interface SymbolicDecision {
  recommendation: string;
  confidence: number;
  ethicsScore: number;
  dataPoints: number;
  reasoning: string[];
  uncertaintyFactors: string[];
}

export interface WeightVector {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
}

export interface DynamicRankingConfig {
  costWeight: number;
  timeWeight: number;  
  reliabilityWeight: number;
  riskWeight: number;
  emergencyMode: boolean;
  maxBudget?: number;
  maxTransitDays?: number;
}

export interface CanonicalShipment {
  id: number;
  request_reference?: string;
  date_of_collection: string;
  date_of_arrival_destination: string;
  date_of_greenlight_to_pickup: string;
  mode_of_shipment: string;
  initial_quote_awarded: number | string;
  final_quote_awarded_freight_forwarder_carrier: number | string;
  kuehne_nagel: number | string;
  scan_global_logistics: number | string;
  dhl_express: number | string;
  dhl_global: number | string;
  siginon: number | string;
  agl: number | string;
  freight_in_time: number | string;
  bwosi: number | string;
  origin: string;
  destination: string;
  origin_country?: string;
  destination_country?: string;
  origin_latitude?: number | string;
  origin_longitude?: number | string;
  destination_latitude?: number | string;
  destination_longitude?: number | string;
  cargo_type: string;
  cargo_description?: string;
  item_category?: string;
  weight_kg: number | string;
  volume_cbm: number | string;
  carrier: string;
  routing: string;
  transit_days: number | string;
  actual_cost: number | string;
  freight_carrier_cost?: number | string;
  fuel_surcharge: number | string;
  insurance: number | string;
  customs_brokerage: number | string;
  port_handling: number | string;
  storage: number | string;
  demurrage: number | string;
  other_charges: number | string;
  total_cost: number | string;
  delay_days: number | string;
  damage: boolean;
  loss: boolean;
  customer_complaints: string;
  documentation_errors: boolean;
  communication_issues: boolean;
  payment_issues: boolean;
  shipment_status: string;
  delivery_status: string;
  temperature_control_failures: boolean;
  security_breaches: boolean;
  risk_assessment_score: number | string;
  sustainability_metrics: number | string;
  customer_satisfaction_score: number | string;
  market_volatility_impact: number | string;
  regulatory_compliance_issues: boolean;
  force_majeure_events: boolean;
  visibility_and_tracking_accuracy: number | string;
  exception_handling_effectiveness: number | string;
  overall_performance_score: number | string;
  neutrosophic_interpretation?: NeutrosophicValue;
}
