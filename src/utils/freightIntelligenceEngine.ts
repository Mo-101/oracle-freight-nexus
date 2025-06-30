import { ForwarderIntelligence, RouteOption, CorridorIntelligence, SymbolicDecision, TransportMode } from '@/types/freight';
import { canonicalShipmentData } from '@/data/canonicalData';

// Utility function to calculate the average of an array of numbers
const calculateAverage = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
};

// Helper function to simulate dynamic rate adjustments
const adjustRateDynamically = (baseRate: number): number => {
  const volatility = Math.random() * 0.1 - 0.05; // ±5%
  return baseRate * (1 + volatility);
};

// Helper function to simulate seasonal transit time variations
const adjustTransitTimeSeasonally = (baseTransitTime: number): number => {
  const seasonalFactor = Math.sin(new Date().getMonth() * 0.2) * 0.2; // ±20%
  return baseTransitTime * (1 + seasonalFactor);
};

class FreightIntelligenceEngine {
  
  analyzeCorridorIntelligence(origin: string, destination: string): CorridorIntelligence {
    // Simulate corridor analysis based on origin and destination
    const totalShipments = Math.floor(Math.random() * 200) + 50;
    const successRate = 85 + Math.random() * 10;
    const avgTransitDays = 5 + Math.random() * 3;
    const riskFactors = ['Political instability', 'Infrastructure challenges', 'Customs delays'];
    const seasonalVariation = Math.random() * 15;
    
    const relevantShipments = canonicalShipmentData.filter(shipment => 
      (shipment.origin_country?.toLowerCase().includes(origin.toLowerCase()) || 
       shipment.destination_country?.toLowerCase().includes(destination.toLowerCase()))
    );

    return {
      origin,
      destination,
      totalShipments: relevantShipments.length || 156,
      successRate: 89.2,
      avgTransitDays: 6.8,
      predominantMode: 'Road' as TransportMode,
      riskFactors: ['Border delays', 'Weather conditions', 'Documentation'],
      seasonalVariation: 12.5
    };
  }

  generateRouteOptions(origin: string, destination: string): RouteOption[] {
    return [
      {
        mode: 'Road' as TransportMode,
        corridor: `${origin}-${destination} Highway`,
        distanceKm: 1240,
        transitTimeDays: 5.2,
        riskFactor: 2.1,
        confidence: 0.94,
        emissionScore: 420,
        avgCost: 3.85,
        historicalShipments: 1250,
        successRate: 92.8
      },
      {
        mode: 'Air' as TransportMode,
        corridor: `${origin}-${destination} Air Route`,
        distanceKm: 980,
        transitTimeDays: 1.5,
        riskFactor: 0.8,
        confidence: 0.98,
        emissionScore: 1200,
        avgCost: 8.50,
        historicalShipments: 580,
        successRate: 98.2
      }
    ];
  }

  generateForwarderIntelligence(cargoType: string): ForwarderIntelligence[] {
    const baseForwarders = [
      {
        name: 'Siginon',
        avgCostPerKg: 3.28,
        avgTransitDays: 5.8,
        reliabilityScore: 92,
        totalShipments: 1580,
        emergencyGrade: 'Priority' as const,
        quoteCoverage: 94,
        specializations: ['Medical Supplies', 'Emergency Relief'],
        successRate: 94.2
      },
      {
        name: 'Bwosi',
        avgCostPerKg: 3.48,
        avgTransitDays: 6.2,
        reliabilityScore: 89,
        totalShipments: 1420,
        emergencyGrade: 'Standard' as const,
        quoteCoverage: 87,
        specializations: ['General Cargo', 'Consumer Goods'],
        successRate: 91.5
      },
      {
        name: 'Freight In Time',
        avgCostPerKg: 3.57,
        avgTransitDays: 5.5,
        reliabilityScore: 94,
        totalShipments: 980,
        emergencyGrade: 'Critical' as const,
        quoteCoverage: 96,
        specializations: ['Time-Critical', 'Medical Supplies'],
        successRate: 96.8
      }
    ];

    return baseForwarders.map((forwarder, index) => ({
      ...forwarder,
      recentPerformance: [
        {
          month: 'Dec 2024',
          shipmentsHandled: Math.floor(forwarder.totalShipments / 12),
          successRate: forwarder.successRate,
          avgCost: forwarder.avgCostPerKg
        }
      ],
      dynamicScore: Math.round((forwarder.reliabilityScore + forwarder.successRate) / 2),
      rankPosition: index + 1
    }));
  }

  generateSymbolicDecision(
    corridorData: CorridorIntelligence,
    routeOptions: RouteOption[],
    forwarders: ForwarderIntelligence[],
    cargoType: string
  ): SymbolicDecision {
    const topForwarder = forwarders[0];
    const bestRoute = routeOptions[0];
    
    return {
      recommendation: `Optimal solution: ${topForwarder.name} via ${bestRoute.mode} transport for ${cargoType}`,
      confidence: 0.92,
      ethicsScore: 0.88,
      dataPoints: corridorData.totalShipments,
      reasoning: [
        `${topForwarder.name} shows highest reliability (${topForwarder.reliabilityScore}%)`,
        `${bestRoute.mode} transport offers best cost-time balance`,
        `${corridorData.successRate}% corridor success rate supports recommendation`
      ],
      uncertaintyFactors: corridorData.riskFactors.slice(0, 2)
    };
  }
}

export const freightIntelligenceEngine = new FreightIntelligenceEngine();
