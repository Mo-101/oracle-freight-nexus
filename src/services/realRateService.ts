import { canonicalShipmentData } from '@/data/canonicalData';
import { CanonicalShipment, RealTimeRate, ForwarderIntelligence } from '@/types/freight';

interface RouteMetrics {
  avgCostPerKg: number;
  avgTransitDays: number;
  reliability: number;
  sampleSize: number;
  lastUpdated: Date;
}

interface MarketRateAdjustment {
  forwarder: string;
  route: string;
  adjustmentFactor: number;
  lastUpdated: Date;
  source: 'user_input' | 'market_data' | 'api';
}

class RealRateService {
  private marketAdjustments: Map<string, MarketRateAdjustment> = new Map();
  private routeMetrics: Map<string, RouteMetrics> = new Map();
  private lastDataRefresh: Date = new Date();

  constructor() {
    this.initializeFromCanonicalData();
  }

  private initializeFromCanonicalData(): void {
    console.log('🔄 RealRateService: Initializing from canonical data...');
    
    // Group data by origin-destination-forwarder combinations
    const routeForwarderData = new Map<string, CanonicalShipment[]>();
    
    canonicalShipmentData.forEach(shipment => {
      const forwarders = this.extractForwarderData(shipment);
      
      forwarders.forEach(({ forwarder, cost, transitDays, delivered }) => {
        if (cost > 0) { // Only include actual quotes
          const key = `${shipment.origin_country}-${shipment.destination_country}-${forwarder}`;
          if (!routeForwarderData.has(key)) {
            routeForwarderData.set(key, []);
          }
          routeForwarderData.get(key)!.push(shipment);
        }
      });
    });

    // Calculate metrics for each route-forwarder combination
    routeForwarderData.forEach((shipments, key) => {
      const metrics = this.calculateRouteMetrics(shipments);
      this.routeMetrics.set(key, metrics);
    });

    console.log(`✅ RealRateService: Initialized with ${this.routeMetrics.size} route-forwarder combinations`);
  }

  private extractForwarderData(shipment: CanonicalShipment): Array<{forwarder: string, cost: number, transitDays: number, delivered: boolean}> {
    const forwarders = [];
    const transitDays = this.calculateTransitDays(shipment.date_of_collection, shipment.date_of_arrival_destination);
    const delivered = shipment.delivery_status === 'Delivered';

    // Map all forwarder columns
    const forwarderMap = {
      'Kuehne Nagel': shipment.kuehne_nagel,
      'Scan Global Logistics': shipment.scan_global_logistics,
      'DHL Express': shipment.dhl_express,
      'DHL Global': shipment.dhl_global,
      'BWOSI': shipment.bwosi,
      'AGL': shipment.agl,
      'Siginon': shipment.siginon,
      'Freight in Time': shipment.freight_in_time
    };

    Object.entries(forwarderMap).forEach(([forwarder, cost]) => {
      if (cost && Number(cost) > 0) {
        forwarders.push({ forwarder, cost: Number(cost), transitDays, delivered });
      }
    });

    return forwarders;
  }

  private calculateTransitDays(collectionDate: string, arrivalDate: string): number {
    if (!collectionDate || !arrivalDate) return 0;
    
    const collection = new Date(collectionDate);
    const arrival = new Date(arrivalDate);
    const diffTime = Math.abs(arrival.getTime() - collection.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private calculateRouteMetrics(shipments: CanonicalShipment[]): RouteMetrics {
    const costs = shipments.map(s => Number(s.freight_carrier_cost) / (Number(s.weight_kg) || 1));
    const transitDays = shipments.map(s => this.calculateTransitDays(s.date_of_collection, s.date_of_arrival_destination)).filter(d => d > 0);
    const deliveredCount = shipments.filter(s => s.delivery_status === 'Delivered').length;

    return {
      avgCostPerKg: costs.reduce((a, b) => a + b, 0) / costs.length,
      avgTransitDays: transitDays.reduce((a, b) => a + b, 0) / transitDays.length || 0,
      reliability: (deliveredCount / shipments.length) * 100,
      sampleSize: shipments.length,
      lastUpdated: new Date()
    };
  }

  public generateRealTimeRate(forwarderName: string, origin: string, destination: string, weight: number = 1000): RealTimeRate {
    const routeKey = `${origin}-${destination}-${forwarderName}`;
    const adjustmentKey = `${forwarderName}-${origin}-${destination}`;
    
    // Get base rate from canonical data
    const metrics = this.routeMetrics.get(routeKey);
    const adjustment = this.marketAdjustments.get(adjustmentKey);
    
    let baseRate: number;
    
    if (metrics) {
      // Use actual historical data
      baseRate = metrics.avgCostPerKg * weight;
    } else {
      // Fallback to industry averages based on distance/region
      baseRate = this.estimateBaseRate(origin, destination, weight);
    }

    // Apply market adjustments if available
    if (adjustment) {
      baseRate *= adjustment.adjustmentFactor;
    }

    // Calculate breakdown
    const fuelSurcharge = Math.round(baseRate * 0.15 * 100) / 100;
    const securityFee = Math.round(baseRate * 0.05 * 100) / 100;
    const handlingFee = Math.round(baseRate * 0.08 * 100) / 100;
    const customsFee = Math.round(baseRate * 0.12 * 100) / 100;
    const insuranceRate = Math.round(baseRate * 0.03 * 100) / 100;
    const totalRate = Math.round((baseRate + fuelSurcharge + securityFee + handlingFee + customsFee + insuranceRate) * 100) / 100;

    return {
      baseRate: Math.round(baseRate * 100) / 100,
      fuelSurcharge,
      securityFee,
      handlingFee,
      customsFee,
      insuranceRate,
      totalRate,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      currency: 'USD',
      source: metrics ? 'historical_data' : 'estimated',
      confidence: metrics ? Math.min(100, metrics.sampleSize * 10) : 50,
      lastUpdated: metrics?.lastUpdated || this.lastDataRefresh
    };
  }

  private estimateBaseRate(origin: string, destination: string, weight: number): number {
    // Basic estimation based on regions (you can enhance this)
    const regionalRates = {
      'Kenya-Zimbabwe': 2.5,
      'Kenya-Zambia': 2.8,
      'Kenya-Madagascar': 3.2,
      'Kenya-Comoros': 4.0,
      'Kenya-South Sudan': 2.0,
      'Kenya-Mayotte': 4.5,
      'Kenya-Mauritius': 3.8,
      'Kenya-Ethiopia': 1.8,
      'Kenya-Congo Brazzaville': 3.5,
      'Kenya-Malawi': 2.9,
      'Kenya-Burundi': 2.2
    };

    const routeKey = `${origin}-${destination}`;
    const rate = regionalRates[routeKey] || 3.0; // Default rate per kg
    
    return rate * weight;
  }

  public updateMarketRate(forwarder: string, origin: string, destination: string, adjustmentFactor: number, source: 'user_input' | 'market_data' | 'api' = 'user_input'): void {
    const key = `${forwarder}-${origin}-${destination}`;
    
    this.marketAdjustments.set(key, {
      forwarder,
      route: `${origin}-${destination}`,
      adjustmentFactor,
      lastUpdated: new Date(),
      source
    });

    console.log(`📈 Market rate updated for ${forwarder} on ${origin}-${destination}: ${adjustmentFactor}x`);
  }

  public getRouteMetrics(origin: string, destination: string, forwarder?: string): RouteMetrics | null {
    if (forwarder) {
      const key = `${origin}-${destination}-${forwarder}`;
      return this.routeMetrics.get(key) || null;
    }

    // Return aggregated metrics for all forwarders on this route
    const routeKeys = Array.from(this.routeMetrics.keys()).filter(key => 
      key.startsWith(`${origin}-${destination}-`)
    );

    if (routeKeys.length === 0) return null;

    const allMetrics = routeKeys.map(key => this.routeMetrics.get(key)!);
    const totalSamples = allMetrics.reduce((sum, m) => sum + m.sampleSize, 0);

    return {
      avgCostPerKg: allMetrics.reduce((sum, m) => sum + (m.avgCostPerKg * m.sampleSize), 0) / totalSamples,
      avgTransitDays: allMetrics.reduce((sum, m) => sum + (m.avgTransitDays * m.sampleSize), 0) / totalSamples,
      reliability: allMetrics.reduce((sum, m) => sum + (m.reliability * m.sampleSize), 0) / totalSamples,
      sampleSize: totalSamples,
      lastUpdated: new Date()
    };
  }

  public getAvailableRoutes(): string[] {
    const routes = new Set<string>();
    this.routeMetrics.forEach((_, key) => {
      const [origin, destination] = key.split('-');
      routes.add(`${origin}-${destination}`);
    });
    return Array.from(routes);
  }

  public getForwardersForRoute(origin: string, destination: string): string[] {
    const forwarders = new Set<string>();
    this.routeMetrics.forEach((_, key) => {
      const parts = key.split('-');
      if (parts.length >= 3 && parts[0] === origin && parts[1] === destination) {
        forwarders.add(parts.slice(2).join('-'));
      }
    });
    return Array.from(forwarders);
  }

  public getDataFreshness(): { lastRefresh: Date, totalRoutes: number, totalForwarders: number } {
    const forwarders = new Set<string>();
    this.routeMetrics.forEach((_, key) => {
      const parts = key.split('-');
      if (parts.length >= 3) {
        forwarders.add(parts.slice(2).join('-'));
      }
    });

    return {
      lastRefresh: this.lastDataRefresh,
      totalRoutes: this.getAvailableRoutes().length,
      totalForwarders: forwarders.size
    };
  }
}

export const realRateService = new RealRateService();