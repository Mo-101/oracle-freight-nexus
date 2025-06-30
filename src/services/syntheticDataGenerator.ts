import { CanonicalShipment } from '@/types/freight';

interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

const kenyaLocations: Location[] = [
  { city: 'Nairobi', country: 'Kenya', latitude: -1.2921, longitude: 36.8219 },
  { city: 'Mombasa', country: 'Kenya', latitude: -4.0435, longitude: 39.6682 },
  { city: 'Kisumu', country: 'Kenya', latitude: -0.0917, longitude: 34.7536 }
];

const zambiaLocations: Location[] = [
  { city: 'Lusaka', country: 'Zambia', latitude: -15.4135, longitude: 28.2772 },
  { city: 'Ndola', country: 'Zambia', latitude: -12.9586, longitude: 28.6463 },
  { city: 'Kitwe', country: 'Zambia', latitude: -12.8167, longitude: 28.2167 }
];

const cargoTypes = ['General', 'Perishable', 'Fragile', 'Medical', 'Electronics'];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export class SyntheticDataGenerator {
  generateLocation(): Location {
    const locations = Math.random() > 0.5 ? kenyaLocations : zambiaLocations;
    return getRandomElement(locations);
  }

  generateCargoType(): string {
    return getRandomElement(cargoTypes);
  }

  generateWeight(): number {
    return Math.floor(100 + Math.random() * 10000);
  }

  generateVolume(): number {
    return Math.round((1 + Math.random() * 50) * 10) / 10;
  }

  generateTransitDays(): number {
    return Math.floor(1 + Math.random() * 10);
  }

  generateCost(): number {
    return Math.round((1 + Math.random() * 10) * 100) / 100;
  }

  generateDelay(): number {
    return Math.floor(Math.random() * 5);
  }

  generateDamage(): boolean {
    return Math.random() > 0.8;
  }

  generateLoss(): boolean {
    return Math.random() > 0.9;
  }

  generateCanonicalShipment(baseShipment?: Partial<CanonicalShipment>): CanonicalShipment {
    const forwarders = ['Kuehne Nagel', 'DHL Express', 'Siginon', 'AGL', 'Freight In Time', 'Bwosi', 'Scan Global Logistics', 'DHL Global'];
    const randomForwarder = forwarders[Math.floor(Math.random() * forwarders.length)];
    
    return {
      request_reference: `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date_of_collection: new Date().toISOString().split('T')[0],
      date_of_arrival_destination: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      date_of_greenlight_to_pickup: new Date().toISOString().split('T')[0],
      mode_of_shipment: 'Road',
      cargo_description: baseShipment?.cargo_description || 'General Cargo',
      item_category: baseShipment?.item_category || 'Commercial Goods',
      id: Math.floor(Math.random() * 10000),
      initial_quote_awarded: Math.round((3 + Math.random() * 2) * 100) / 100,
      final_quote_awarded_freight_forwarder_carrier: Math.round((3.5 + Math.random() * 2) * 100) / 100,
      kuehne_nagel: Math.round((3.8 + Math.random() * 0.5) * 100) / 100,
      scan_global_logistics: Math.round((3.5 + Math.random() * 0.8) * 100) / 100,
      dhl_express: Math.round((5.5 + Math.random() * 1) * 100) / 100,
      dhl_global: Math.round((4.8 + Math.random() * 0.8) * 100) / 100,
      siginon: Math.round((3.2 + Math.random() * 0.4) * 100) / 100,
      agl: Math.round((3.8 + Math.random() * 0.6) * 100) / 100,
      freight_in_time: Math.round((3.6 + Math.random() * 0.5) * 100) / 100,
      bwosi: Math.round((3.4 + Math.random() * 0.6) * 100) / 100,
      origin: baseShipment?.origin || 'Kenya',
      destination: baseShipment?.destination || 'Zambia',
      origin_country: 'Kenya',
      destination_country: 'Zambia',
      origin_latitude: -1.2921,
      origin_longitude: 36.8219,
      destination_latitude: -15.3875,
      destination_longitude: 28.3228,
      cargo_type: baseShipment?.cargo_type || 'General',
      weight_kg: baseShipment?.weight_kg || Math.floor(500 + Math.random() * 2000),
      volume_cbm: baseShipment?.volume_cbm || Math.round((10 + Math.random() * 50) * 10) / 10,
      carrier: randomForwarder,
      routing: 'Road Transport',
      transit_days: Math.floor(5 + Math.random() * 5),
      actual_cost: Math.round((3 + Math.random() * 3) * 100) / 100,
      freight_carrier_cost: Math.round((2.5 + Math.random() * 2) * 100) / 100,
      fuel_surcharge: Math.round((0.5 + Math.random() * 0.8) * 100) / 100,
      insurance: Math.round((0.05 + Math.random() * 0.15) * 100) / 100,
      customs_brokerage: Math.round((0.05 + Math.random() * 0.1) * 100) / 100,
      port_handling: Math.round((0.1 + Math.random() * 0.3) * 100) / 100,
      storage: Math.round(Math.random() * 0.5 * 100) / 100,
      demurrage: Math.round(Math.random() * 0.2 * 100) / 100,
      other_charges: Math.round(Math.random() * 0.3 * 100) / 100,
      total_cost: Math.round((4 + Math.random() * 4) * 100) / 100,
      delay_days: Math.floor(Math.random() * 3),
      damage: Math.random() < 0.05,
      loss: Math.random() < 0.02,
      customer_complaints: Math.random() < 0.1 ? 'Minor delay complaint' : '',
      documentation_errors: Math.random() < 0.08,
      communication_issues: Math.random() < 0.06,
      payment_issues: Math.random() < 0.04,
      shipment_status: 'Delivered',
      delivery_status: 'On Time',
      temperature_control_failures: Math.random() < 0.03,
      security_breaches: Math.random() < 0.01,
      risk_assessment_score: Math.round((60 + Math.random() * 40) * 100) / 100,
      sustainability_metrics: Math.round((70 + Math.random() * 30) * 100) / 100,
      customer_satisfaction_score: Math.round((80 + Math.random() * 20) * 100) / 100,
      market_volatility_impact: Math.round((5 + Math.random() * 15) * 100) / 100,
      regulatory_compliance_issues: Math.random() < 0.05,
      force_majeure_events: Math.random() < 0.02,
      visibility_and_tracking_accuracy: Math.round((85 + Math.random() * 15) * 100) / 100,
      exception_handling_effectiveness: Math.round((75 + Math.random() * 25) * 100) / 100,
      overall_performance_score: Math.round((80 + Math.random() * 20) * 100) / 100,
      ...baseShipment
    };
  }

  generateShipments(count: number = 10, baseShipment?: Partial<CanonicalShipment>): CanonicalShipment[] {
    return Array.from({ length: count }, () => this.generateCanonicalShipment(baseShipment));
  }
}

export const canonicalDataGenerator = new SyntheticDataGenerator();
