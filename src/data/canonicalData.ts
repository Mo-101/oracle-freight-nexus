
import { CanonicalShipment } from '@/types/freight';

export const canonicalShipmentData: CanonicalShipment[] = [
  {
    id: "SHIP-001",
    origin_city: "Nairobi",
    origin_country: "Kenya",
    destination_city: "Lusaka",
    destination_country: "Zambia",
    carrier: "DHL Express",
    service_type: "Express",
    weight_kg: 25.5,
    dimensions_cm: "40x30x20",
    freight_carrier_cost: 125.50,
    insurance_cost: 8.75,
    fuel_surcharge: 15.25,
    handling_fee: 12.50,
    total_cost: 162.00,
    transit_time_days: 3,
    delivery_status: "Delivered",
    risk_score: 2,
    environmental_impact: 8.5,
    tracking_number: "DHL123456789KE",
    pickup_date: "2024-01-15",
    delivery_date: "2024-01-18",
    special_requirements: ["Temperature Controlled"],
    customer_rating: 4.8,
    carrier_performance_score: 92,
    route_optimization_score: 88,
    customs_clearance_time: 4,
    packaging_type: "Standard Box",
    cargo_type: "Medical Supplies",
    priority_level: "High",
    weather_impact: 1,
    fuel_efficiency: 7.2,
    carbon_footprint: 45.8,
    compliance_score: 95,
    documentation_complete: true,
    last_updated: "2024-01-20"
  },
  {
    id: "SHIP-002",
    origin_city: "Mombasa",
    origin_country: "Kenya",
    destination_city: "Harare",
    destination_country: "Zimbabwe",
    carrier: "Kuehne Nagel",
    service_type: "Standard",
    weight_kg: 150.0,
    dimensions_cm: "80x60x40",
    freight_carrier_cost: 285.00,
    insurance_cost: 22.50,
    fuel_surcharge: 35.00,
    handling_fee: 25.00,
    total_cost: 367.50,
    transit_time_days: 7,
    delivery_status: "In Transit",
    risk_score: 3,
    environmental_impact: 12.3,
    tracking_number: "KN987654321KE",
    pickup_date: "2024-01-20",
    delivery_date: "2024-01-27",
    special_requirements: ["Fragile", "Heavy Machinery"],
    customer_rating: 4.2,
    carrier_performance_score: 87,
    route_optimization_score: 85,
    customs_clearance_time: 8,
    packaging_type: "Heavy Duty Crate",
    cargo_type: "Industrial Equipment",
    priority_level: "Medium",
    weather_impact: 2,
    fuel_efficiency: 6.8,
    carbon_footprint: 78.4,
    compliance_score: 91,
    documentation_complete: true,
    last_updated: "2024-01-22"
  }
];

// Helper function to get forwarder performance data
export const getForwarderPerformance = (forwarderName: string) => {
  const performanceData: Record<string, any> = {
    'Kuehne Nagel': {
      totalShipments: 142,
      avgCostPerKg: 4.2,
      avgTransitDays: 6.8,
      onTimeRate: 0.89,
      reliabilityScore: 87
    },
    'DHL Express': {
      totalShipments: 98,
      avgCostPerKg: 5.8,
      avgTransitDays: 3.2,
      onTimeRate: 0.94,
      reliabilityScore: 92
    },
    'DHL Global': {
      totalShipments: 76,
      avgCostPerKg: 4.9,
      avgTransitDays: 5.1,
      onTimeRate: 0.91,
      reliabilityScore: 89
    },
    'Scan Global Logistics': {
      totalShipments: 63,
      avgCostPerKg: 4.1,
      avgTransitDays: 7.3,
      onTimeRate: 0.85,
      reliabilityScore: 83
    },
    'Siginon Logistics': {
      totalShipments: 54,
      avgCostPerKg: 3.8,
      avgTransitDays: 8.2,
      onTimeRate: 0.82,
      reliabilityScore: 81
    },
    'Agility Logistics': {
      totalShipments: 41,
      avgCostPerKg: 4.5,
      avgTransitDays: 6.9,
      onTimeRate: 0.86,
      reliabilityScore: 84
    },
    'Freight In Time': {
      totalShipments: 38,
      avgCostPerKg: 4.3,
      avgTransitDays: 7.6,
      onTimeRate: 0.83,
      reliabilityScore: 82
    },
    'BWOSI': {
      totalShipments: 29,
      avgCostPerKg: 4.7,
      avgTransitDays: 8.9,
      onTimeRate: 0.79,
      reliabilityScore: 78
    }
  };

  return performanceData[forwarderName] || {
    totalShipments: 0,
    avgCostPerKg: 4.5,
    avgTransitDays: 7.0,
    onTimeRate: 0.80,
    reliabilityScore: 75
  };
};

// Helper function to get unique forwarders
export const getUniqueForwarders = (): string[] => {
  return [
    'Kuehne Nagel',
    'DHL Express', 
    'DHL Global',
    'Scan Global Logistics',
    'Siginon Logistics',
    'Agility Logistics',
    'Freight In Time',
    'BWOSI'
  ];
};
