// Pan-African Logistics Routing Service with Live Google Maps Integration
// Part of DeepCAL++ Symbolic Intelligence System

interface RouteData {
  distance: string;
  duration: string;
  summary: string;
  steps: string[];
  trafficConditions: string;
  alternativeRoutes: number;
  warnings: string[];
}

interface LocationData {
  name: string;
  coordinates: [number, number];
  region: string;
  country: string;
  riskLevel: number;
  portStatus?: string;
  customsComplexity?: number;
}

interface AfricanLogisticsContext {
  majorHubs: LocationData[];
  regionalCorridors: { [key: string]: string[] };
  riskFactors: { [key: string]: number };
  seasonalVariations: { [key: string]: any };
}

class PanAfricanRoutingService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
  
  // Major African logistics hubs and their strategic importance
  private africanHubs: LocationData[] = [
    { name: 'Lagos', coordinates: [6.5244, 3.3792], region: 'ECOWAS', country: 'Nigeria', riskLevel: 7, portStatus: 'congested' },
    { name: 'Dakar', coordinates: [14.7167, -17.4677], region: 'ECOWAS', country: 'Senegal', riskLevel: 8, portStatus: 'efficient' },
    { name: 'Abidjan', coordinates: [5.3600, -4.0083], region: 'ECOWAS', country: 'Côte d\'Ivoire', riskLevel: 7, portStatus: 'moderate' },
    { name: 'Mombasa', coordinates: [-4.0435, 39.6682], region: 'EAC', country: 'Kenya', riskLevel: 8, portStatus: 'expanding' },
    { name: 'Dar es Salaam', coordinates: [-6.7924, 39.2083], region: 'EAC', country: 'Tanzania', riskLevel: 7, portStatus: 'growing' },
    { name: 'Cape Town', coordinates: [-33.9249, 18.4241], region: 'SADC', country: 'South Africa', riskLevel: 9, portStatus: 'premium' },
    { name: 'Johannesburg', coordinates: [-26.2041, 28.0473], region: 'SADC', country: 'South Africa', riskLevel: 8, customsComplexity: 3 },
    { name: 'Durban', coordinates: [-29.8587, 31.0218], region: 'SADC', country: 'South Africa', riskLevel: 8, portStatus: 'efficient' },
    { name: 'Djibouti', coordinates: [11.8251, 42.5903], region: 'Horn', country: 'Djibouti', riskLevel: 6, portStatus: 'strategic' },
    { name: 'Addis Ababa', coordinates: [9.1450, 40.4897], region: 'Horn', country: 'Ethiopia', riskLevel: 6, customsComplexity: 5 },
    { name: 'Cairo', coordinates: [30.0444, 31.2357], region: 'North Africa', country: 'Egypt', riskLevel: 7, customsComplexity: 4 },
    { name: 'Casablanca', coordinates: [33.5731, -7.5898], region: 'North Africa', country: 'Morocco', riskLevel: 8, portStatus: 'modern' },
    { name: 'Algiers', coordinates: [36.7538, 3.0588], region: 'North Africa', country: 'Algeria', riskLevel: 6, customsComplexity: 6 },
    { name: 'Tunis', coordinates: [36.8065, 10.1815], region: 'North Africa', country: 'Tunisia', riskLevel: 7, portStatus: 'moderate' },
    { name: 'Douala', coordinates: [4.0511, 9.7679], region: 'Central Africa', country: 'Cameroon', riskLevel: 5, portStatus: 'gateway' },
    { name: 'Kinshasa', coordinates: [-4.4419, 15.2663], region: 'Central Africa', country: 'DRC', riskLevel: 4, customsComplexity: 8 },
    { name: 'Luanda', coordinates: [-8.8390, 13.2894], region: 'Central Africa', country: 'Angola', riskLevel: 5, portStatus: 'developing' },
    { name: 'Lusaka', coordinates: [-15.3875, 28.3228], region: 'SADC', country: 'Zambia', riskLevel: 7, customsComplexity: 4 },
    { name: 'Harare', coordinates: [-17.8292, 31.0522], region: 'SADC', country: 'Zimbabwe', riskLevel: 5, customsComplexity: 6 },
    { name: 'Maputo', coordinates: [-25.9692, 32.5732], region: 'SADC', country: 'Mozambique', riskLevel: 6, portStatus: 'expanding' }
  ];

  // Regional logistics corridors and their characteristics
  private corridors = {
    'ECOWAS': ['Lagos-Dakar Backbone', 'Abidjan-Bamako', 'Tema-Ouagadougou', 'Cotonou-Niamey'],
    'SADC': ['Cape Town-Johannesburg', 'Durban-Johannesburg', 'Maputo-Johannesburg', 'Walvis Bay-Johannesburg'],
    'EAC': ['Mombasa-Kampala', 'Dar es Salaam-Kampala', 'Mombasa-Kigali', 'Dar es Salaam-Kigali'],
    'North Africa': ['Cairo-Alexandria', 'Casablanca-Rabat', 'Algiers-Oran', 'Tunis-Sfax'],
    'Central Africa': ['Douala-Yaoundé', 'Douala-Bangui', 'Kinshasa-Matadi', 'Luanda-Lobito'],
    'Trans-Saharan': ['Algiers-Lagos', 'Cairo-Cape Town', 'Tripoli-Ndjamena'],
    'Horn of Africa': ['Djibouti-Addis Ababa', 'Berbera-Addis Ababa', 'Mombasa-Juba']
  };

  constructor(apiKey: string = 'AIzaSyDummyKeyForDemo') {
    this.apiKey = apiKey;
  }

  async fetchLiveRoute(origin: string, destination: string, options: any = {}): Promise<RouteData> {
    try {
      const params = new URLSearchParams({
        origin: origin,
        destination: destination,
        key: this.apiKey,
        region: 'af', // Africa-focused results
        mode: options.mode || 'driving',
        traffic_model: 'best_guess',
        departure_time: 'now',
        alternatives: 'true',
        language: 'en'
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Google Maps API error: ${data.status}`);
      }

      const route = data.routes[0];
      const leg = route.legs[0];

      return {
        distance: leg.distance.text,
        duration: leg.duration.text,
        summary: route.summary,
        steps: leg.steps.map((step: any) => step.html_instructions),
        trafficConditions: leg.duration_in_traffic ? 
          this.analyzeTrafficConditions(leg.duration.value, leg.duration_in_traffic.value) : 'Unknown',
        alternativeRoutes: data.routes.length - 1,
        warnings: route.warnings || []
      };
    } catch (error) {
      console.error('Routing service error:', error);
      return this.generateFallbackRoute(origin, destination);
    }
  }

  async analyzeLogisticsCorridor(origin: string, destination: string): Promise<any> {
    const routeData = await this.fetchLiveRoute(origin, destination);
    const originHub = this.findNearestHub(origin);
    const destinationHub = this.findNearestHub(destination);
    
    return {
      routeData,
      corridorAnalysis: {
        originHub,
        destinationHub,
        regionalComplexity: this.calculateRegionalComplexity(originHub, destinationHub),
        riskAssessment: this.assessCorridorRisk(originHub, destinationHub),
        recommendedCarriers: this.getCorridorCarriers(originHub, destinationHub),
        crossBorderPoints: this.identifyCrossBorderPoints(originHub, destinationHub),
        seasonalFactors: this.getSeasonalFactors(originHub, destinationHub)
      }
    };
  }

  private findNearestHub(location: string): LocationData {
    // Simple matching logic - in production, use geocoding and distance calculation
    const hub = this.africanHubs.find(h => 
      location.toLowerCase().includes(h.name.toLowerCase()) ||
      location.toLowerCase().includes(h.country.toLowerCase())
    );
    return hub || this.africanHubs[0]; // Fallback to first hub
  }

  private calculateRegionalComplexity(origin: LocationData, destination: LocationData): number {
    let complexity = 1;
    
    // Different regions add complexity
    if (origin.region !== destination.region) complexity += 2;
    
    // Certain regions have inherent complexity
    if (origin.region === 'Central Africa' || destination.region === 'Central Africa') complexity += 3;
    if (origin.region === 'Horn' || destination.region === 'Horn') complexity += 2;
    
    // Customs complexity
    complexity += (origin.customsComplexity || 0) + (destination.customsComplexity || 0);
    
    return Math.min(complexity, 10); // Cap at 10
  }

  private assessCorridorRisk(origin: LocationData, destination: LocationData): number {
    const avgRisk = (origin.riskLevel + destination.riskLevel) / 2;
    
    // Adjust for regional factors
    let adjustment = 0;
    if (origin.region === 'Central Africa' || destination.region === 'Central Africa') adjustment -= 1;
    if (origin.region === 'SADC' && destination.region === 'SADC') adjustment += 1;
    
    return Math.max(1, Math.min(10, avgRisk + adjustment));
  }

  private getCorridorCarriers(origin: LocationData, destination: LocationData): string[] {
    const carriers = [];
    
    // Global carriers
    carriers.push('Kuehne Nagel', 'DHL Express', 'Bolloré Logistics');
    
    // Regional specialists
    if (origin.region === 'ECOWAS' || destination.region === 'ECOWAS') {
      carriers.push('GETMA', 'Sococim Industries');
    }
    if (origin.region === 'EAC' || destination.region === 'EAC') {
      carriers.push('Siginon Logistics', 'Kenya Airways Cargo');
    }
    if (origin.region === 'SADC' || destination.region === 'SADC') {
      carriers.push('Imperial Logistics', 'Bidvest Logistics');
    }
    
    return carriers;
  }

  private identifyCrossBorderPoints(origin: LocationData, destination: LocationData): string[] {
    // Simplified - in production, use actual border crossing data
    if (origin.country === destination.country) return [];
    
    const crossings = [];
    if (origin.region !== destination.region) {
      crossings.push(`${origin.country}-${destination.country} Border`);
    }
    
    return crossings;
  }

  private getSeasonalFactors(origin: LocationData, destination: LocationData): any {
    const currentMonth = new Date().getMonth();
    const factors = {
      rainySeasonRisk: false,
      dustStormRisk: false,
      floodRisk: false,
      recommendations: []
    };

    // Rainy season considerations (simplified)
    if (currentMonth >= 5 && currentMonth <= 9) { // June to October
      if (origin.region === 'ECOWAS' || destination.region === 'ECOWAS') {
        factors.rainySeasonRisk = true;
        factors.recommendations.push('Monitor road conditions in West Africa');
      }
    }

    // Dust storm season (Harmattan)
    if (currentMonth >= 11 || currentMonth <= 2) { // December to March
      if (origin.region === 'ECOWAS' || destination.region === 'ECOWAS') {
        factors.dustStormRisk = true;
        factors.recommendations.push('Dust storm season - consider air cargo delays');
      }
    }

    return factors;
  }

  private analyzeTrafficConditions(normalDuration: number, trafficDuration: number): string {
    const ratio = trafficDuration / normalDuration;
    
    if (ratio < 1.1) return 'Light traffic';
    if (ratio < 1.3) return 'Moderate traffic';
    if (ratio < 1.5) return 'Heavy traffic';
    return 'Severe congestion';
  }

  private generateFallbackRoute(origin: string, destination: string): RouteData {
    return {
      distance: 'Calculating...',
      duration: 'Calculating...',
      summary: `Route from ${origin} to ${destination}`,
      steps: ['Fetching route data...'],
      trafficConditions: 'Unknown',
      alternativeRoutes: 0,
      warnings: ['Unable to fetch live data - using symbolic estimation']
    };
  }

  // Get contextual information for deepTalk
  getContextualIntelligence(origin: string, destination: string): string {
    const originHub = this.findNearestHub(origin);
    const destinationHub = this.findNearestHub(destination);
    const risk = this.assessCorridorRisk(originHub, destinationHub);
    const complexity = this.calculateRegionalComplexity(originHub, destinationHub);
    
    return `
Route Intelligence:
- Origin: ${originHub.name} (${originHub.region}, Risk: ${originHub.riskLevel}/10)
- Destination: ${destinationHub.name} (${destinationHub.region}, Risk: ${destinationHub.riskLevel}/10)
- Corridor Risk: ${risk}/10
- Complexity: ${complexity}/10
- Recommended Carriers: ${this.getCorridorCarriers(originHub, destinationHub).join(', ')}
- Cross-border Points: ${this.identifyCrossBorderPoints(originHub, destinationHub).join(', ') || 'Domestic route'}
`;
  }

  // Regional expertise queries
  getRegionalExpertise(region: string): string {
    const expertise = {
      'ECOWAS': 'West Africa expertise: Lagos-Dakar backbone, variable customs, high trade volume',
      'SADC': 'Southern Africa expertise: Excellent infrastructure, reliable timelines, efficient ports',
      'EAC': 'East Africa expertise: Rapid growth, SGR rail network, Mombasa gateway efficiency',
      'North Africa': 'North Africa expertise: Mediterranean connections, geopolitical variables',
      'Central Africa': 'Central Africa expertise: Challenging terrain, security considerations, vital corridors',
      'Horn': 'Horn of Africa expertise: Djibouti strategic hub, Ethiopia growth, security matrix'
    };
    
    return expertise[region] || 'Regional expertise available on request';
  }
}

export const routingService = new PanAfricanRoutingService();
export type { RouteData, LocationData, AfricanLogisticsContext };