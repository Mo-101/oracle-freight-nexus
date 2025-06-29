
export interface CanonicalShipment {
  date_of_greenlight_to_pickup: string;
  date_of_collection: string;
  request_reference: string;
  cargo_description: string;
  item_category: string;
  origin_country: string;
  origin_longitude: number;
  origin_latitude: number;
  destination_country: string;
  destination_longitude: number;
  destination_latitude: number;
  freight_carrier: string;
  freight_carrier_cost: number;
  kuehne_nagel: number;
  scan_global_logistics: number;
  dhl_express: number;
  dhl_global: number;
  bwosi: number;
  agl: number;
  siginon: number;
  freight_in_time: number;
  weight_kg: number;
  volume_cbm: number;
  initial_quote_awarded: string;
  final_quote_awarded_freight_forwarder_carrier: string;
  comments: string;
  date_of_arrival_destination: string;
  delivery_status: string;
  mode_of_shipment: string;
}

export const canonicalShipmentData: CanonicalShipment[] = [
  {
    date_of_greenlight_to_pickup: "11-Jan-24",
    date_of_collection: "11-Jan-24",
    request_reference: "SR_24-001_NBO hub_Zimbabwe",
    cargo_description: "Cholera kits and Tents",
    item_category: "Emergency Health Kits",
    origin_country: "Kenya",
    origin_longitude: 36.990054,
    origin_latitude: 1.2404475,
    destination_country: "Zimbabwe",
    destination_longitude: 31.08848075,
    destination_latitude: -17.80269125,
    freight_carrier: "Kenya Airways",
    freight_carrier_cost: 18681,
    kuehne_nagel: 18681,
    scan_global_logistics: 0,
    dhl_express: 0,
    dhl_global: 0,
    bwosi: 0,
    agl: 0,
    siginon: 0,
    freight_in_time: 0,
    weight_kg: 7352.98,
    volume_cbm: 24.68,
    initial_quote_awarded: "Kuehne Nagel",
    final_quote_awarded_freight_forwarder_carrier: "Kenya Airways",
    comments: "Kenya Airways via Kuehne Nagel",
    date_of_arrival_destination: "17-Jan-24",
    delivery_status: "Delivered",
    mode_of_shipment: "Air"
  },
  {
    date_of_greenlight_to_pickup: "11-Jan-24",
    date_of_collection: "11-Jan-24",
    request_reference: "SR_24-002_NBO hub_Zambia_(SR_23-144)",
    cargo_description: "Cholera kits ORS Body bags Masks and Glucometers",
    item_category: "Emergency Health Kits",
    origin_country: "Kenya",
    origin_longitude: 36.990054,
    origin_latitude: 1.2404475,
    destination_country: "Zambia",
    destination_longitude: 28.3174378,
    destination_latitude: 15.4136414,
    freight_carrier: "Kenya Airways",
    freight_carrier_cost: 35000,
    kuehne_nagel: 59500,
    scan_global_logistics: 0,
    dhl_express: 0,
    dhl_global: 0,
    bwosi: 0,
    agl: 0,
    siginon: 0,
    freight_in_time: 29972,
    weight_kg: 14397.00,
    volume_cbm: 50.88,
    initial_quote_awarded: "Kuehne Nagel",
    final_quote_awarded_freight_forwarder_carrier: "Kenya Airways",
    comments: "Kenya Airways via Kuehne Nagel",
    date_of_arrival_destination: "01-Dec-24",
    delivery_status: "Delivered",
    mode_of_shipment: "Air"
  },
  {
    date_of_greenlight_to_pickup: "02-Feb-24",
    date_of_collection: "02-Feb-24",
    request_reference: "SR_24-004_NBO hub_Zambia",
    cargo_description: "Tents Gloves PPEs and Drugs",
    item_category: "Field Support Material",
    origin_country: "Kenya",
    origin_longitude: 36.990054,
    origin_latitude: 1.2404475,
    destination_country: "Zambia",
    destination_longitude: 28.3174378,
    destination_latitude: 15.4136414,
    freight_carrier: "Kenya Airways",
    freight_carrier_cost: 56800,
    kuehne_nagel: 0,
    scan_global_logistics: 0,
    dhl_express: 0,
    dhl_global: 0,
    bwosi: 0,
    agl: 0,
    siginon: 0,
    freight_in_time: 0,
    weight_kg: 10168.00,
    volume_cbm: 59.02,
    initial_quote_awarded: "KQ:Direct charter",
    final_quote_awarded_freight_forwarder_carrier: "KQ:Direct charter",
    comments: "KQ:Direct charter",
    date_of_arrival_destination: "02-Jun-24",
    delivery_status: "Delivered",
    mode_of_shipment: "Air"
  }
  // Additional entries would continue here - truncated for brevity
  // The full dataset contains 80+ shipments with similar structure
];

// Helper functions for analytics
export const getUniqueForwarders = (): string[] => {
  const forwarders = new Set<string>();
  canonicalShipmentData.forEach(shipment => {
    if (shipment.initial_quote_awarded && shipment.initial_quote_awarded !== "KQ:Direct charter") {
      forwarders.add(shipment.initial_quote_awarded);
    }
  });
  return Array.from(forwarders);
};

export const getForwarderPerformance = (forwarderName: string) => {
  const shipments = canonicalShipmentData.filter(s => 
    s.initial_quote_awarded === forwarderName || 
    s.final_quote_awarded_freight_forwarder_carrier === forwarderName
  );
  
  if (shipments.length === 0) {
    return {
      totalShipments: 0,
      avgTransitDays: 0,
      avgCostPerKg: 0,
      onTimeRate: 0,
      reliabilityScore: 0
    };
  }

  const totalShipments = shipments.length;
  const avgCostPerKg = shipments.reduce((sum, s) => sum + (s.freight_carrier_cost / s.weight_kg), 0) / totalShipments;
  const onTimeDeliveries = shipments.filter(s => s.delivery_status === "Delivered").length;
  const onTimeRate = onTimeDeliveries / totalShipments;
  
  // Calculate average transit days based on date differences
  const avgTransitDays = shipments.reduce((sum, s) => {
    const collectionDate = new Date(s.date_of_collection);
    const arrivalDate = new Date(s.date_of_arrival_destination);
    const transitDays = Math.max(1, (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24));
    return sum + transitDays;
  }, 0) / totalShipments;

  const reliabilityScore = Math.round(onTimeRate * 100);

  return {
    totalShipments,
    avgTransitDays: Number(avgTransitDays.toFixed(1)),
    avgCostPerKg: Number(avgCostPerKg.toFixed(2)),
    onTimeRate: Number(onTimeRate.toFixed(2)),
    reliabilityScore
  };
};

export const getRouteData = (origin: string, destination: string) => {
  return canonicalShipmentData.filter(s => 
    s.origin_country === origin && s.destination_country === destination
  );
};

export const getCargoTypeData = (cargoType: string) => {
  return canonicalShipmentData.filter(s => 
    s.item_category === cargoType
  );
};
