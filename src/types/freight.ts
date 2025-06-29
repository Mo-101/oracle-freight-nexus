
export type TransportMode = "Air" | "Sea" | "Land" | "Rail";

export interface RouteOption {
  mode: TransportMode;
  corridor: string;
  distanceKm: number;
  transitTimeDays: number;
  riskFactor: number; // 0-10
  emissionScore: number; // gCO2/km
  confidence: number; // 0-1 symbolic score
  historicalShipments: number;
  successRate: number;
  avgCost: number;
}

export interface ForwarderIntelligence {
  name: string;
  totalShipments: number;
  avgCostPerKg: number;
  avgTransitDays: number;
  successRate: number;
  reliabilityScore: number;
  specializations: string[];
  emergencyGrade: 'Standard' | 'Priority' | 'Critical';
  recentPerformance: PerformanceMetric[];
  quoteCoverage: number; // percentage of routes quoted
}

export interface PerformanceMetric {
  month: string;
  shipmentsHandled: number;
  successRate: number;
  avgCost: number;
}

export interface CorridorIntelligence {
  origin: string;
  destination: string;
  totalShipments: number;
  successRate: number;
  avgTransitDays: number;
  predominantMode: TransportMode;
  seasonalVariation: number;
  riskFactors: string[];
}

export interface SymbolicDecision {
  recommendation: string;
  confidence: number;
  reasoning: string[];
  dataPoints: number;
  ethicsScore: number;
  uncertaintyFactors: string[];
}

export interface CanonicalShipment {
  id: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  carrier: string;
  service_type: string;
  weight_kg: number;
  dimensions_cm: string;
  freight_carrier_cost: number;
  insurance_cost: number;
  fuel_surcharge: number;
  handling_fee: number;
  total_cost: number;
  transit_time_days: number;
  delivery_status: string;
  risk_score: number;
  environmental_impact: number;
  tracking_number: string;
  pickup_date: string;
  delivery_date: string;
  special_requirements: string[];
  customer_rating: number;
  carrier_performance_score: number;
  route_optimization_score: number;
  customs_clearance_time: number;
  packaging_type: string;
  cargo_type: string;
  priority_level: string;
  weather_impact: number;
  fuel_efficiency: number;
  carbon_footprint: number;
  compliance_score: number;
  documentation_complete: boolean;
  last_updated: string;
  
  // Additional properties expected by freight intelligence engine
  date_of_collection: string;
  date_of_arrival_destination: string;
  mode_of_shipment: string;
  initial_quote_awarded?: string;
  final_quote_awarded_freight_forwarder_carrier?: string;
  item_category: string;
  cargo_description: string;
  
  // Quote properties for different forwarders
  kuehne_nagel?: number;
  scan_global_logistics?: number;
  dhl_express?: number;
  dhl_global?: number;
  siginon?: number;
  agl?: number;
  freight_in_time?: number;
  bwosi?: number;
}
