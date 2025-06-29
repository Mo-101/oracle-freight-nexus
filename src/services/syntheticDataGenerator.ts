
import { CanonicalShipment } from '@/types/freight';

interface SyntheticDataConfig {
  count: number;
  includeWestAfrica: boolean;
  includeNorthAfrica: boolean;
  includeCentralAfrica: boolean;
  includeEdgeCases: boolean;
  languageVariants: string[];
}

class SyntheticDataGenerator {
  private africanCities = {
    east: ['Nairobi', 'Kampala', 'Dar es Salaam', 'Addis Ababa', 'Kigali', 'Juba', 'Mombasa', 'Djibouti'],
    west: ['Lagos', 'Accra', 'Dakar', 'Abidjan', 'Freetown', 'Monrovia', 'Bamako', 'Ouagadougou'],
    north: ['Cairo', 'Tunis', 'Algiers', 'Casablanca', 'Tripoli', 'Alexandria', 'Rabat', 'Benghazi'],
    central: ['Kinshasa', 'Brazzaville', 'Yaoundé', 'Bangui', 'N\'Djamena', 'Libreville', 'Malabo'],
    south: ['Johannesburg', 'Cape Town', 'Durban', 'Lusaka', 'Harare', 'Gaborone', 'Windhoek', 'Maputo']
  };

  private carriers = [
    'Kuehne Nagel', 'Scan Global Logistics', 'DHL Express', 'DHL Global', 
    'Siginon', 'AGL', 'Freight in Time', 'Bwosi', 'Maersk Line', 'MSC',
    'Bollore Logistics', 'Imperial Logistics', 'Expeditors', 'Panalpina'
  ];

  private cargoTypes = [
    'Medical Supplies', 'Electronics', 'Textiles', 'Machinery', 'Food Products',
    'Pharmaceuticals', 'Automotive Parts', 'Mining Equipment', 'Agricultural Products',
    'Construction Materials', 'Oil & Gas Equipment', 'Solar Panels', 'Computers',
    'Emergency Relief', 'Educational Materials', 'Vaccines', 'Water Purification'
  ];

  private emergencyScenarios = [
    'cholera outbreak', 'drought emergency', 'flood relief', 'conflict zone',
    'infrastructure damage', 'port congestion', 'fuel shortage', 'border closure',
    'political instability', 'natural disaster', 'pandemic response', 'refugee crisis'
  ];

  generateSyntheticData(config: SyntheticDataConfig): CanonicalShipment[] {
    const syntheticData: CanonicalShipment[] = [];
    
    for (let i = 0; i < config.count; i++) {
      const shipment = this.generateSingleShipment(i + 1000, config);
      syntheticData.push(shipment);
    }

    return syntheticData;
  }

  private generateSingleShipment(id: number, config: SyntheticDataConfig): CanonicalShipment {
    const origin = this.getRandomCity(config);
    const destination = this.getRandomCity(config, origin);
    const cargoType = this.getRandomElement(this.cargoTypes);
    const carrier = this.getRandomElement(this.carriers);
    const mode = this.getRandomElement(['Air', 'Sea', 'Road', 'Rail']);
    
    const weight = this.getRandomWeight();
    const volume = weight * (0.3 + Math.random() * 0.7); // CBM roughly related to weight
    const distance = this.calculateDistance(origin, destination);
    const transitDays = this.calculateTransitDays(mode, distance);
    
    const baseDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
    const collectionDate = baseDate.toISOString().split('T')[0];
    const greenlightDate = new Date(baseDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const arrivalDate = new Date(baseDate.getTime() + transitDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Generate realistic costs
    const baseCost = this.calculateBaseCost(mode, weight, distance);
    const quotes = this.generateQuotes(baseCost);
    
    return {
      id,
      date_of_collection: collectionDate,
      date_of_arrival_destination: arrivalDate,
      date_of_greenlight_to_pickup: greenlightDate,
      mode_of_shipment: mode,
      initial_quote_awarded: quotes.initial,
      final_quote_awarded_freight_forwarder_carrier: quotes.final,
      kuehne_nagel: quotes.kuehne_nagel,
      scan_global_logistics: quotes.scan_global,
      dhl_express: quotes.dhl_express,
      dhl_global: quotes.dhl_global,
      siginon: quotes.siginon,
      agl: quotes.agl,
      freight_in_time: quotes.freight_in_time,
      bwosi: quotes.bwosi,
      origin,
      destination,
      cargo_type: cargoType,
      weight_kg: weight,
      volume_cbm: volume,
      carrier,
      routing: this.generateRouting(origin, destination, mode),
      transit_days: transitDays,
      actual_cost: baseCost * (0.9 + Math.random() * 0.2),
      fuel_surcharge: baseCost * 0.15 * Math.random(),
      insurance: baseCost * 0.05 * Math.random(),
      customs_brokerage: 200 + Math.random() * 800,
      port_handling: mode === 'Sea' ? 300 + Math.random() * 700 : 0,
      storage: Math.random() * 500,
      demurrage: Math.random() < 0.1 ? Math.random() * 2000 : 0,
      other_charges: Math.random() * 300,
      total_cost: 0, // Will be calculated
      delay_days: Math.random() < 0.3 ? Math.floor(Math.random() * 10) : 0,
      damage: Math.random() < 0.05,
      loss: Math.random() < 0.02,
      customer_complaints: Math.random() < 0.1 ? this.generateComplaint() : '',
      documentation_errors: Math.random() < 0.15,
      communication_issues: Math.random() < 0.2,
      payment_issues: Math.random() < 0.1,
      shipment_status: this.getRandomElement(['Delivered', 'In Transit', 'Delayed', 'Damaged']),
      delivery_status: this.getRandomElement(['On Time', 'Delayed', 'Damaged', 'Lost']),
      temperature_control_failures: cargoType.includes('Medical') ? Math.random() < 0.05 : false,
      security_breaches: Math.random() < 0.03,
      risk_assessment_score: Math.random() * 100,
      sustainability_metrics: Math.random() * 100,
      customer_satisfaction_score: Math.random() * 100,
      market_volatility_impact: Math.random() * 50,
      regulatory_compliance_issues: Math.random() < 0.08,
      force_majeure_events: config.includeEdgeCases ? Math.random() < 0.1 : false,
      visibility_and_tracking_accuracy: Math.random() * 100,
      exception_handling_effectiveness: Math.random() * 100,
      overall_performance_score: Math.random() * 100
    };
  }

  private getRandomCity(config: SyntheticDataConfig, exclude?: string): string {
    let allCities = [...this.africanCities.east, ...this.africanCities.south];
    
    if (config.includeWestAfrica) allCities.push(...this.africanCities.west);
    if (config.includeNorthAfrica) allCities.push(...this.africanCities.north);
    if (config.includeCentralAfrica) allCities.push(...this.africanCities.central);
    
    if (exclude) {
      allCities = allCities.filter(city => city !== exclude);
    }
    
    return this.getRandomElement(allCities);
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomWeight(): number {
    // Realistic weight distribution for African logistics
    const rand = Math.random();
    if (rand < 0.3) return 50 + Math.random() * 200; // Small shipments
    if (rand < 0.6) return 250 + Math.random() * 750; // Medium shipments
    if (rand < 0.9) return 1000 + Math.random() * 4000; // Large shipments
    return 5000 + Math.random() * 15000; // Very large shipments
  }

  private calculateDistance(origin: string, destination: string): number {
    // Simplified distance calculation - would use real geolocation in production
    const africaCityDistances: Record<string, number> = {
      'Nairobi-Lagos': 3200,
      'Cairo-Cape Town': 6500,
      'Dakar-Addis Ababa': 5800,
      'Johannesburg-Kinshasa': 1800
    };
    
    const key = `${origin}-${destination}`;
    const reverseKey = `${destination}-${origin}`;
    
    return africaCityDistances[key] || africaCityDistances[reverseKey] || 
           1000 + Math.random() * 4000; // Random realistic distance
  }

  private calculateTransitDays(mode: string, distance: number): number {
    const speeds = { Air: 1, Road: 50, Rail: 80, Sea: 500 };
    const baseSpeed = speeds[mode as keyof typeof speeds] || 100;
    return Math.ceil(distance / baseSpeed) + Math.floor(Math.random() * 3);
  }

  private calculateBaseCost(mode: string, weight: number, distance: number): number {
    const ratePer100Kg = { Air: 5, Road: 1.5, Rail: 1.2, Sea: 0.8 };
    const baseRate = ratePer100Kg[mode as keyof typeof ratePer100Kg] || 2;
    return (weight / 100) * baseRate * (distance / 1000) * 100;
  }

  private generateQuotes(baseCost: number): Record<string, number> {
    const variation = () => baseCost * (0.8 + Math.random() * 0.4);
    
    return {
      initial: baseCost,
      final: baseCost * (0.9 + Math.random() * 0.2),
      kuehne_nagel: variation(),
      scan_global: variation(),
      dhl_express: variation() * 1.3, // Premium carrier
      dhl_global: variation() * 1.1,
      siginon: variation() * 0.9,
      agl: variation(),
      freight_in_time: variation(),
      bwosi: variation() * 0.95
    };
  }

  private generateRouting(origin: string, destination: string, mode: string): string {
    const hubs = {
      Air: ['Nairobi', 'Johannesburg', 'Cairo', 'Lagos'],
      Sea: ['Mombasa', 'Durban', 'Lagos', 'Alexandria'],
      Road: ['Kampala', 'Lusaka', 'Accra'],
      Rail: ['Dar es Salaam', 'Maputo']
    };
    
    const relevantHubs = hubs[mode as keyof typeof hubs] || [];
    const hub = relevantHubs[Math.floor(Math.random() * relevantHubs.length)];
    
    return hub ? `${origin} → ${hub} → ${destination}` : `${origin} → ${destination}`;
  }

  private generateComplaint(): string {
    const complaints = [
      'Delayed delivery affecting operations',
      'Damaged packaging upon arrival',
      'Poor communication during transit',
      'Incorrect documentation',
      'Temperature control issues',
      'Missing items from shipment',
      'Customs clearance delays'
    ];
    return this.getRandomElement(complaints);
  }

  // Export to JSONL for fine-tuning
  exportToJSONL(data: CanonicalShipment[]): string {
    return data.map(shipment => {
      const prompt = `Analyze this African logistics shipment: ${shipment.cargo_type} from ${shipment.origin} to ${shipment.destination}, ${shipment.weight_kg}kg via ${shipment.mode_of_shipment}`;
      const response = `Based on historical data, this ${shipment.cargo_type} shipment from ${shipment.origin} to ${shipment.destination} should take ${shipment.transit_days} days via ${shipment.mode_of_shipment}. The optimal carrier is ${shipment.carrier} with cost estimate $${shipment.actual_cost.toFixed(2)}. Risk factors include ${shipment.delay_days > 0 ? 'potential delays' : 'standard risk profile'}.`;
      
      return JSON.stringify({
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: response }
        ]
      });
    }).join('\n');
  }
}

export const syntheticDataGenerator = new SyntheticDataGenerator();
