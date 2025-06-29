
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
