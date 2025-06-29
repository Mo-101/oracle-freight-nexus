
import { useState, useCallback } from 'react';
import { deepcalModelAPI } from '../services/deepcalModelAPI';
import { 
  ForwarderPrediction, 
  ShipmentFeatures, 
  EnhancedForwarderRanking 
} from '../types/modelTypes';
import { convertFormDataToFeatures, validateFeatures } from '../utils/modelFeatureConverter';

interface UseModelPredictionsResult {
  predictions: ForwarderPrediction[];
  isLoading: boolean;
  error: string | null;
  isModelAvailable: boolean;
  fetchPredictions: (formData: any, forwarders: string[]) => Promise<void>;
  checkModelHealth: () => Promise<void>;
}

export const useModelPredictions = (): UseModelPredictionsResult => {
  const [predictions, setPredictions] = useState<ForwarderPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelAvailable, setIsModelAvailable] = useState(true);

  const checkModelHealth = useCallback(async () => {
    try {
      const healthy = await deepcalModelAPI.healthCheck();
      setIsModelAvailable(healthy);
      if (!healthy) {
        console.warn('🤖 Model API is not available, will use fallback methods');
      }
    } catch (err) {
      setIsModelAvailable(false);
      console.warn('🤖 Model health check failed:', err);
    }
  }, []);

  const fetchPredictions = useCallback(async (formData: any, forwarders: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert form data to model features (without carrier, we'll add that per forwarder)
      const baseFeatures = convertFormDataToFeatures(formData, '');
      const { carrier_enc, ...featuresWithoutCarrier } = baseFeatures;
      
      if (!validateFeatures(baseFeatures)) {
        throw new Error('Invalid or incomplete shipment features');
      }

      console.log('🤖 Fetching predictions for forwarders:', forwarders);
      
      const predictionResults = await deepcalModelAPI.predictForwarders(
        featuresWithoutCarrier,
        forwarders
      );
      
      setPredictions(predictionResults);
      setIsModelAvailable(true);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch predictions';
      setError(errorMessage);
      setIsModelAvailable(false);
      setPredictions([]);
      console.error('🤖 Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    predictions,
    isLoading,
    error,
    isModelAvailable,
    fetchPredictions,
    checkModelHealth
  };
};
