
import { ShipmentFeatures } from '../types/modelTypes';
import { deepcalModelAPI } from '../services/deepcalModelAPI';

interface FormDataInput {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  cargoType: string;
}

export const convertFormDataToFeatures = (
  formData: FormDataInput,
  forwarder: string
): ShipmentFeatures => {
  // Extract coordinates from location strings (simplified - in production use geocoding)
  const getCoordinates = (location: string) => {
    const locationMap: { [key: string]: { lat: number; lng: number } } = {
      'Nairobi, Kenya': { lat: -1.2921, lng: 36.8219 },
      'Lusaka, Zambia': { lat: -15.3875, lng: 28.3228 },
      'Johannesburg, South Africa': { lat: -26.2041, lng: 28.0473 },
      'Lagos, Nigeria': { lat: 6.5244, lng: 3.3792 },
      'Dubai, UAE': { lat: 25.2048, lng: 55.2708 },
      'Shanghai, China': { lat: 31.2304, lng: 121.4737 }
    };
    return locationMap[location] || { lat: 0, lng: 0 };
  };

  const destinationCoords = getCoordinates(formData.destination);
  const originCountry = formData.origin.split(', ')[1] || 'Unknown';
  const destinationCountry = formData.destination.split(', ')[1] || 'Unknown';

  // Calculate urgency level based on cargo type
  const getUrgencyLevel = (cargoType: string): number => {
    if (cargoType.includes('Emergency')) return 3;
    if (cargoType.includes('Pharmaceuticals')) return 2;
    return 1;
  };

  const features: ShipmentFeatures = {
    destination_latitude: destinationCoords.lat,
    destination_longitude: destinationCoords.lng,
    destination_country_enc: deepcalModelAPI.encodeCountry(destinationCountry),
    carrier_enc: deepcalModelAPI.encodeCarrier(forwarder),
    weight_kg: formData.weight,
    volume_cbm: formData.volume,
    cargo_type_enc: deepcalModelAPI.encodeCargoType(formData.cargoType),
    origin_country_enc: deepcalModelAPI.encodeCountry(originCountry),
    urgency_level: getUrgencyLevel(formData.cargoType),
    seasonal_factor: getSeason() // Current season factor
  };

  return features;
};

const getSeason = (): number => {
  const month = new Date().getMonth() + 1;
  // Simplified seasonal encoding: 1=dry, 2=wet, 3=peak
  if (month >= 6 && month <= 8) return 1; // Dry season
  if (month >= 12 || month <= 2) return 2; // Wet season
  return 3; // Peak season
};

export const validateFeatures = (features: ShipmentFeatures): boolean => {
  const requiredFields = [
    'destination_latitude',
    'destination_longitude', 
    'weight_kg',
    'volume_cbm'
  ];
  
  return requiredFields.every(field => 
    features[field as keyof ShipmentFeatures] !== undefined && 
    features[field as keyof ShipmentFeatures] !== null
  );
};
