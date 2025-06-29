
import { 
  ShipmentFeatures, 
  ModelResponse, 
  ModelAPIError, 
  ForwarderPrediction,
  SHAPExplanation 
} from '../types/modelTypes';

interface DeepCALModelConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
}

class DeepCALModelAPI {
  private config: DeepCALModelConfig;

  constructor(config: DeepCALModelConfig) {
    this.config = config;
  }

  async predict(features: ShipmentFeatures): Promise<ModelResponse> {
    console.log('🤖 DeepCAL Model API: Making prediction request...', features);
    
    try {
      const response = await fetch(`${this.config.apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(features),
        signal: AbortSignal.timeout(this.config.timeout),
      });

      if (!response.ok) {
        const errorData: ModelAPIError = await response.json();
        throw new Error(`Model API Error: ${errorData.detail || response.statusText}`);
      }

      const prediction: ModelResponse = await response.json();
      console.log('🤖 Model prediction successful:', prediction);
      
      return prediction;
    } catch (error) {
      console.error('🤖 Model API Error:', error);
      throw error;
    }
  }

  async predictForwarders(
    baseFeatures: Omit<ShipmentFeatures, 'carrier_enc'>, 
    forwarders: string[]
  ): Promise<ForwarderPrediction[]> {
    console.log('🤖 Predicting for multiple forwarders:', forwarders);
    
    const predictions = await Promise.allSettled(
      forwarders.map(async (forwarder, index) => {
        const features: ShipmentFeatures = {
          ...baseFeatures,
          carrier_enc: this.encodeCarrier(forwarder)
        };
        
        const prediction = await this.predict(features);
        
        return {
          forwarder,
          prediction: {
            mode_of_shipment: prediction.mode_of_shipment,
            risk_cluster: prediction.risk_cluster,
            predicted_transit_days: prediction.predicted_transit_days,
            predicted_cost_usd: prediction.predicted_cost_usd,
            reliability_score: prediction.reliability_score,
            confidence: prediction.confidence
          },
          shap_explanation: prediction.shap_explanation
        };
      })
    );

    // Extract successful predictions and log failed ones
    const results: ForwarderPrediction[] = [];
    predictions.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.warn(`🤖 Prediction failed for ${forwarders[index]}:`, result.reason);
      }
    });

    return results;
  }

  private encodeCarrier(carrierName: string): number {
    // Simple encoding - in production, use your trained encoders
    const carrierMap: { [key: string]: number } = {
      'Kuehne + Nagel': 1,
      'DHL Global Forwarding': 2,
      'Siginon Logistics': 3,
      'Imperial Logistics': 4,
      'Bollore Africa': 5,
      'DHL Express': 6,
      'Scan Global Logistics': 7,
      'Agility Logistics': 8
    };
    return carrierMap[carrierName] || 0;
  }

  encodeCountry(countryName: string): number {
    // Simple encoding - in production, use your trained encoders
    const countryMap: { [key: string]: number } = {
      'Kenya': 1,
      'Zambia': 2,
      'South Africa': 3,
      'Nigeria': 4,
      'UAE': 5,
      'China': 6
    };
    return countryMap[countryName] || 0;
  }

  encodeCargoType(cargoType: string): number {
    // Simple encoding - in production, use your trained encoders
    const cargoMap: { [key: string]: number } = {
      'Emergency Health Kits': 1,
      'Pharmaceuticals': 2,
      'Laboratory Equipment': 3,
      'Cold Chain Supplies': 4,
      'Medical Supplies': 5
    };
    return cargoMap[cargoType] || 0;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch (error) {
      console.warn('🤖 Model API health check failed:', error);
      return false;
    }
  }
}

// Export configured client
export const deepcalModelAPI = new DeepCALModelAPI({
  apiUrl: import.meta.env.VITE_DEEPCAL_MODEL_API_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds
  retries: 2
});

export default deepcalModelAPI;
