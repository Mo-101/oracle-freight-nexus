import { canonicalShipmentData, getForwarderPerformance } from '@/data/canonicalData';
import { 
  RouteOption, 
  ForwarderIntelligence, 
  CorridorIntelligence, 
  SymbolicDecision,
  TransportMode 
} from '@/types/freight';

export class FreightIntelligenceEngine {
  
  // Helper function to safely parse unknown values to numbers
  private safeParseFloat(value: unknown): number | null {
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  }

  analyzeCorridorIntelligence(origin: string, destination: string): CorridorIntelligence {
    const corridorShipments = canonicalShipmentData.filter(
      s => s.origin === origin && s.destination === destination
    );

    const totalShipments = corridorShipments.length;
    const successfulShipments = corridorShipments.filter(s => s.delivery_status === 'On Time').length;
    const successRate = totalShipments > 0 ? Math.round((successfulShipments / totalShipments) * 100) : 0;

    // Calculate average transit days
    const avgTransitDays = totalShipments > 0 
      ? Math.round(corridorShipments.reduce((sum, s) => {
          const collectionDate = new Date(s.date_of_collection);
          const arrivalDate = new Date(s.date_of_arrival_destination);
          const transitDays = Math.max(1, (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24));
          return sum + transitDays;
        }, 0) / totalShipments)
      : 7;

    // Determine predominant mode
    const modeCount = corridorShipments.reduce((acc, s) => {
      acc[s.mode_of_shipment as TransportMode] = (acc[s.mode_of_shipment as TransportMode] || 0) + 1;
      return acc;
    }, {} as Record<TransportMode, number>);

    const predominantMode = Object.keys(modeCount).reduce((a, b) => 
      modeCount[a as TransportMode] > modeCount[b as TransportMode] ? a : b
    ) as TransportMode || 'Air';

    // Identify risk factors
    const riskFactors: string[] = [];
    if (successRate < 90) riskFactors.push('Below average success rate');
    if (avgTransitDays > 10) riskFactors.push('Extended transit times');
    
    const seasonalVariation = this.calculateSeasonalVariation(corridorShipments);
    if (seasonalVariation > 30) riskFactors.push('High seasonal variation');

    return {
      origin,
      destination,
      totalShipments,
      successRate,
      avgTransitDays,
      predominantMode,
      seasonalVariation,
      riskFactors
    };
  }

  generateRouteOptions(origin: string, destination: string): RouteOption[] {
    const corridorShipments = canonicalShipmentData.filter(
      s => s.origin === origin && s.destination === destination
    );

    const routeOptions: RouteOption[] = [];

    // Air Route Analysis
    const airShipments = corridorShipments.filter(s => s.mode_of_shipment === 'Air');
    if (airShipments.length > 0) {
      routeOptions.push({
        mode: 'Air',
        corridor: `${origin}-${destination} Air Corridor`,
        distanceKm: this.calculateDistance(origin, destination),
        transitTimeDays: this.calculateAvgTransitDays(airShipments),
        riskFactor: this.calculateRiskFactor(airShipments),
        emissionScore: 150, // Higher emissions for air
        confidence: this.calculateConfidence(airShipments),
        historicalShipments: airShipments.length,
        successRate: this.calculateSuccessRate(airShipments),
        avgCost: this.calculateAvgCost(airShipments)
      });
    }

    // Sea Route Analysis
    const seaShipments = corridorShipments.filter(s => s.mode_of_shipment === 'Sea');
    if (seaShipments.length > 0) {
      routeOptions.push({
        mode: 'Sea',
        corridor: `${origin}-${destination} Maritime Route`,
        distanceKm: this.calculateDistance(origin, destination) * 1.3, // Sea routes are longer
        transitTimeDays: this.calculateAvgTransitDays(seaShipments),
        riskFactor: this.calculateRiskFactor(seaShipments),
        emissionScore: 25, // Lower emissions for sea
        confidence: this.calculateConfidence(seaShipments),
        historicalShipments: seaShipments.length,
        successRate: this.calculateSuccessRate(seaShipments),
        avgCost: this.calculateAvgCost(seaShipments)
      });
    }

    // Land Route Analysis
    const landShipments = corridorShipments.filter(s => s.mode_of_shipment === 'Road');
    if (landShipments.length > 0) {
      routeOptions.push({
        mode: 'Land',
        corridor: `${origin}-${destination} Road Network`,
        distanceKm: this.calculateDistance(origin, destination) * 1.2, // Road routes slightly longer
        transitTimeDays: this.calculateAvgTransitDays(landShipments),
        riskFactor: this.calculateRiskFactor(landShipments),
        emissionScore: 60, // Medium emissions for land
        confidence: this.calculateConfidence(landShipments),
        historicalShipments: landShipments.length,
        successRate: this.calculateSuccessRate(landShipments),
        avgCost: this.calculateAvgCost(landShipments)
      });
    }

    return routeOptions.sort((a, b) => b.confidence - a.confidence);
  }

  generateForwarderIntelligence(cargoType: string): ForwarderIntelligence[] {
    const forwarderNames = [
      'Kuehne Nagel', 'DHL Express', 'DHL Global', 'Scan Global Logistics',
      'Siginon', 'AGL', 'Freight In Time', 'Bwosi'
    ];

    return forwarderNames.map(name => {
      const performance = getForwarderPerformance(name);
      const forwarderShipments = canonicalShipmentData.filter(s => s.carrier === name);

      const specializations = this.analyzeSpecializations(forwarderShipments);
      const emergencyGrade = this.determineEmergencyGrade(forwarderShipments);
      const quoteCoverage = this.calculateQuoteCoverage(name);

      return {
        name,
        totalShipments: performance.totalShipments,
        avgCostPerKg: performance.avgCostPerKg,
        avgTransitDays: performance.avgTransitDays,
        successRate: Math.round(performance.onTimeRate * 100),
        reliabilityScore: performance.reliabilityScore,
        specializations,
        emergencyGrade,
        recentPerformance: this.generateRecentPerformance(forwarderShipments),
        quoteCoverage
      };
    }).filter(f => f.totalShipments > 0)
      .sort((a, b) => b.reliabilityScore - a.reliabilityScore);
  }

  generateSymbolicDecision(
    corridorData: CorridorIntelligence,
    routeOptions: RouteOption[],
    forwarders: ForwarderIntelligence[],
    cargoType: string
  ): SymbolicDecision {
    const topRoute = routeOptions[0];
    const topForwarder = forwarders[0];
    
    const reasoning: string[] = [
      `${topRoute.mode} transport selected based on ${topRoute.historicalShipments} successful precedents`,
      `${topForwarder.name} demonstrates ${topForwarder.reliabilityScore}% reliability across ${topForwarder.totalShipments} shipments`,
      `Corridor analysis shows ${corridorData.successRate}% success rate for ${corridorData.origin}-${corridorData.destination}`,
      `Cargo type "${cargoType}" optimization yields ${Math.round(topRoute.confidence * 100)}% confidence`,
      `Multi-modal analysis confirms ${topRoute.mode} as optimal for current conditions`
    ];

    const uncertaintyFactors: string[] = [];
    if (corridorData.riskFactors.length > 0) {
      uncertaintyFactors.push(...corridorData.riskFactors.map(rf => `Risk: ${rf}`));
    }
    if (topRoute.confidence < 0.8) {
      uncertaintyFactors.push('Limited historical data for exact route configuration');
    }

    const ethicsScore = this.calculateEthicsScore(topRoute, topForwarder);
    
    return {
      recommendation: `${topRoute.mode} via ${topForwarder.name}`,
      confidence: Math.min(topRoute.confidence, topForwarder.reliabilityScore / 100),
      reasoning,
      dataPoints: corridorData.totalShipments + topForwarder.totalShipments,
      ethicsScore,
      uncertaintyFactors
    };
  }

  private calculateDistance(origin: string, destination: string): number {
    // Simplified distance calculation - in reality would use geo coordinates
    const distanceMap: Record<string, Record<string, number>> = {
      'Kenya': {
        'Zambia': 2100,
        'Zimbabwe': 2400,
        'Madagascar': 2800,
        'Comoros': 1200,
        'Ethiopia': 1100,
        'Uganda': 500,
        'Rwanda': 800,
        'Burundi': 900,
        'Tanzania': 600
      }
    };
    
    return distanceMap[origin]?.[destination] || 2000;
  }

  private calculateAvgTransitDays(shipments: any[]): number {
    if (shipments.length === 0) return 7;
    
    const shipmentsWithValidDates = shipments.filter(s => {
      const collectionDate = new Date(s.date_of_collection);
      const arrivalDate = new Date(s.date_of_arrival_destination);
      return !isNaN(collectionDate.getTime()) && !isNaN(arrivalDate.getTime());
    });

    if (shipmentsWithValidDates.length === 0) return 7;
    
    const totalDays = shipmentsWithValidDates.reduce((sum, s) => {
      const collectionDate = new Date(s.date_of_collection);
      const arrivalDate = new Date(s.date_of_arrival_destination);
      const transitDays = Math.max(1, (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + transitDays;
    }, 0);
    
    return Math.round(totalDays / shipmentsWithValidDates.length * 10) / 10;
  }

  private calculateRiskFactor(shipments: any[]): number {
    const failedShipments = shipments.filter(s => s.delivery_status !== 'On Time').length;
    const riskPercentage = shipments.length > 0 ? (failedShipments / shipments.length) * 100 : 0;
    return Math.round(riskPercentage / 10); // Convert to 0-10 scale
  }

  private calculateConfidence(shipments: any[]): number {
    if (shipments.length === 0) return 0.5;
    
    const successRate = shipments.filter(s => s.delivery_status === 'On Time').length / shipments.length;
    const dataQuality = Math.min(shipments.length / 10, 1); // More data = higher quality
    
    return Math.round((successRate * 0.7 + dataQuality * 0.3) * 100) / 100;
  }

  private calculateSuccessRate(shipments: any[]): number {
    if (shipments.length === 0) return 0;
    const successful = shipments.filter(s => s.delivery_status === 'On Time').length;
    return Math.round((successful / shipments.length) * 100);
  }

  private calculateAvgCost(shipments: any[]): number {
    if (shipments.length === 0) return 0;
    
    const costsWithData = shipments.filter(s => {
      const costValue = this.safeParseFloat(s.actual_cost);
      const weightValue = this.safeParseFloat(s.weight_kg);
      
      return costValue !== null && weightValue !== null && costValue > 0 && weightValue > 0;
    });

    if (costsWithData.length === 0) return 0;
    
    const totalCost = costsWithData.reduce((sum, s) => {
      const cost = this.safeParseFloat(s.actual_cost);
      const weight = this.safeParseFloat(s.weight_kg);
      
      if (cost !== null && weight !== null && weight > 0) {
        return sum + (cost / weight);
      }
      return sum;
    }, 0);
    
    return Math.round((totalCost / costsWithData.length) * 100) / 100;
  }

  private calculateSeasonalVariation(shipments: any[]): number {
    // Simplified seasonal variation calculation
    const monthlyData = shipments.reduce((acc, s) => {
      const month = new Date(s.date_of_collection).getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const values = Object.values(monthlyData);
    if (values.length === 0) return 0;
    
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    return Math.round(((max - min) / avg) * 100);
  }

  private analyzeSpecializations(shipments: any[]): string[] {
    const cargoTypes = shipments.map(s => s.item_category);
    const typeCounts = cargoTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
  }

  private determineEmergencyGrade(shipments: any[]): 'Standard' | 'Priority' | 'Critical' {
    const emergencyItems = shipments.filter(s => 
      s.item_category.includes('Emergency') || 
      s.cargo_description.toLowerCase().includes('emergency') ||
      s.cargo_description.toLowerCase().includes('cholera')
    ).length;
    
    const emergencyRatio = shipments.length > 0 ? emergencyItems / shipments.length : 0;
    
    if (emergencyRatio > 0.6) return 'Critical';
    if (emergencyRatio > 0.3) return 'Priority';
    return 'Standard';
  }

  private calculateQuoteCoverage(forwarderName: string): number {
    const totalQuoteRequests = canonicalShipmentData.length;
    const forwarderQuotes = canonicalShipmentData.filter(s => {
      const quotes = [
        this.safeParseFloat(s.kuehne_nagel) || 0,
        this.safeParseFloat(s.scan_global_logistics) || 0,
        this.safeParseFloat(s.dhl_express) || 0,
        this.safeParseFloat(s.dhl_global) || 0,
        this.safeParseFloat(s.siginon) || 0,
        this.safeParseFloat(s.agl) || 0,
        this.safeParseFloat(s.freight_in_time) || 0,
        this.safeParseFloat(s.bwosi) || 0
      ];
      
      return quotes.some(quote => typeof quote === 'number' && quote > 0);
    }).length;
    
    return Math.round((forwarderQuotes / totalQuoteRequests) * 100);
  }

  private generateRecentPerformance(shipments: any[]): any[] {
    // Simplified recent performance - would normally use actual recent data
    return [
      { month: 'Dec', shipmentsHandled: shipments.length, successRate: 92, avgCost: 4.5 },
      { month: 'Nov', shipmentsHandled: Math.max(1, shipments.length - 2), successRate: 89, avgCost: 4.7 },
      { month: 'Oct', shipmentsHandled: Math.max(1, shipments.length - 1), successRate: 94, avgCost: 4.3 }
    ];
  }

  private calculateEthicsScore(route: RouteOption, forwarder: ForwarderIntelligence): number {
    let ethicsScore = 0.8; // Base ethics score
    
    // Environmental factor
    if (route.emissionScore < 50) ethicsScore += 0.1;
    else if (route.emissionScore > 100) ethicsScore -= 0.1;
    
    // Reliability factor (reliable service = ethical service)
    ethicsScore += (forwarder.reliabilityScore - 80) / 100 * 0.1;
    
    return Math.max(0, Math.min(1, ethicsScore));
  }
}

export const freightIntelligenceEngine = new FreightIntelligenceEngine();
