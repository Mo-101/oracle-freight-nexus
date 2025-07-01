import { baseDataStore } from '@/services/baseDataStore';
import { neonDataService } from '@/services/neonDataService';
import { NeutrosophicAHP, TNN } from './neutrosophicAHP';
import { DeepCALTOPSIS, TOPSISCriteria, TOPSISAlternative, TOPSISResult } from './deepcalTOPSIS';

export interface DeepCALCriteria {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
}

export interface ForwarderAnalysis {
  forwarder: string;
  avgCostPerKg: number;
  avgTransitDays: number;
  reliabilityScore: number;
  riskLevel: number;
  shipmentCount: number;
  onTimeRate: number;
}

export interface DeepCALDecision {
  ranking: TOPSISResult[];
  criteriaWeights: DeepCALCriteria;
  consistencyRatio: number;
  isConsistent: boolean;
  analysis: string;
  timestamp: Date;
  dataVersion: string;
  analysisId?: string; // New field for Supabase record ID
}

export interface ShipmentData {
  shipment_id: string;
  origin_country: string;
  destination_country: string;
  weight_kg: string | number;
  volume_cbm: string | number;
  cost: string | number;
  forwarder: string;
  transit_days: string | number;
  delay_days?: string | number;
  [key: string]: any;
}

export class DeepCALCore {
  private ahp: NeutrosophicAHP;
  private useNeonCache: boolean = true;

  constructor() {
    baseDataStore.enforceDataLock(); // Strict data-first protocol
    this.ahp = new NeutrosophicAHP({
      consistencyThreshold: 0.1,
      maxIterations: 100
    });
  }

  async analyzeForwarders(): Promise<ForwarderAnalysis[]> {
    // Try to get cached results from Neon first
    if (this.useNeonCache && baseDataStore.isNeonEnabled()) {
      try {
        const cachedPerformance = await neonDataService.getForwarderPerformance();
        if (cachedPerformance.length > 0) {
          console.log('📊 Using cached forwarder performance from Neon');
          return cachedPerformance;
        }
      } catch (error) {
        console.warn('⚠️ Failed to fetch cached performance, falling back to calculation:', error);
      }
    }

    // Fallback to original calculation
    const rawData: ShipmentData[] = baseDataStore.getRawData() as ShipmentData[];
    console.log('🔍 Analyzing forwarders from', rawData.length, 'shipments');

    // Group by forwarder
    const forwarderGroups = rawData.reduce((groups: Record<string, ShipmentData[]>, shipment) => {
      const forwarder = shipment.forwarder || 'Unknown';
      if (!groups[forwarder]) groups[forwarder] = [];
      groups[forwarder].push(shipment);
      return groups;
    }, {});

    const analyses: ForwarderAnalysis[] = [];

    Object.entries(forwarderGroups).forEach(([forwarder, shipments]: [string, ShipmentData[]]) => {
      if (shipments.length === 0) return;

      // Calculate metrics
      const costs = shipments.map(s => parseFloat(s.cost as string) || 0).filter(c => c > 0);
      const weights = shipments.map(s => parseFloat(s.weight_kg as string) || 1).filter(w => w > 0);
      const transitTimes = shipments.map(s => parseFloat(s.transit_days as string) || 0).filter(t => t > 0);
      const delays = shipments.map(s => parseFloat(s.delay_days as string) || 0);
      
      // Cost per kg
      const totalCost = costs.reduce((a, b) => a + b, 0);
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;

      // Average transit time
      const avgTransitDays = transitTimes.length > 0 ? 
        transitTimes.reduce((a, b) => a + b, 0) / transitTimes.length : 0;

      // On-time performance
      const onTimeShipments = delays.filter(d => d <= 0).length;
      const onTimeRate = delays.length > 0 ? onTimeShipments / delays.length : 0;

      // Reliability score (based on on-time rate and consistency)
      const transitStdDev = this.calculateStandardDeviation(transitTimes);
      const consistencyFactor = transitTimes.length > 1 ? Math.max(0, 1 - (transitStdDev / avgTransitDays)) : 1;
      const reliabilityScore = (onTimeRate * 0.7 + consistencyFactor * 0.3) * 100;

      // Risk level (inverted reliability with delay factor)
      const avgDelay = delays.length > 0 ? delays.reduce((a, b) => a + b, 0) / delays.length : 0;
      const riskLevel = Math.max(0, Math.min(100, (1 - onTimeRate) * 100 + avgDelay * 5));

      analyses.push({
        forwarder,
        avgCostPerKg: Math.round(avgCostPerKg * 100) / 100,
        avgTransitDays: Math.round(avgTransitDays * 10) / 10,
        reliabilityScore: Math.round(reliabilityScore * 10) / 10,
        riskLevel: Math.round(riskLevel * 10) / 10,
        shipmentCount: shipments.length,
        onTimeRate: Math.round(onTimeRate * 1000) / 10
      });
    });

    console.log('📈 Forwarder analysis complete:', analyses.length, 'forwarders analyzed');
    return analyses.sort((a, b) => b.shipmentCount - a.shipmentCount);
  }

  private calculateStandardDeviation(values: number[]): number {
    if (values.length <= 1) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance);
  }

  calculateCriteriaWeights(userJudgments?: Record<string, TNN>): {
    weights: DeepCALCriteria;
    consistencyRatio: number;
    isConsistent: boolean;
  } {
    const criteria = ['cost', 'time', 'reliability', 'risk'];
    
    // Default neutrosophic judgments if not provided
    const defaultJudgments = userJudgments || {
      'cost-time': new TNN(0.7, 0.2, 0.1),        // Cost moderately more important than time
      'cost-reliability': new TNN(0.4, 0.3, 0.3), // Cost slightly less important than reliability
      'cost-risk': new TNN(0.6, 0.2, 0.2),        // Cost moderately more important than risk
      'time-reliability': new TNN(0.3, 0.3, 0.4), // Time slightly less important than reliability
      'time-risk': new TNN(0.5, 0.3, 0.2),        // Time equally important as risk
      'reliability-risk': new TNN(0.8, 0.1, 0.1)  // Reliability much more important than risk
    };

    console.log('⚖️ Calculating criteria weights using Neutrosophic AHP');
    
    const pairwiseMatrix = this.ahp.createPairwiseMatrix(criteria, defaultJudgments);
    const result = this.ahp.calculateWeights(pairwiseMatrix);

    const weights: DeepCALCriteria = {
      cost: result.weights[0],
      time: result.weights[1],
      reliability: result.weights[2],
      risk: result.weights[3]
    };

    console.log('📊 Criteria weights calculated:', weights);
    console.log('🔍 Consistency ratio:', result.consistencyRatio);

    return {
      weights,
      consistencyRatio: result.consistencyRatio,
      isConsistent: result.isConsistent
    };
  }

  async makeDecision(forwarders?: string[]): Promise<DeepCALDecision> {
    console.log('🧠 DeepCAL Core: Starting decision analysis...');
    
    // Get forwarder analyses
    const allForwarders = await this.analyzeForwarders();
    const targetForwarders = forwarders ? 
      allForwarders.filter(f => forwarders.includes(f.forwarder)) : 
      allForwarders.slice(0, 8); // Top 8 by shipment count

    if (targetForwarders.length === 0) {
      throw new Error('No forwarders found for analysis');
    }

    // Calculate criteria weights
    const { weights, consistencyRatio, isConsistent } = this.calculateCriteriaWeights();

    // Set up TOPSIS
    const topsis = new DeepCALTOPSIS([
      { name: 'cost', weight: weights.cost, beneficial: false },      // Minimize cost
      { name: 'time', weight: weights.time, beneficial: false },      // Minimize time
      { name: 'reliability', weight: weights.reliability, beneficial: true }, // Maximize reliability
      { name: 'risk', weight: weights.risk, beneficial: false }       // Minimize risk
    ]);

    // Add alternatives
    targetForwarders.forEach(forwarder => {
      // Normalize values for TOPSIS (0-100 scale)
      const normalizedCost = Math.min(100, forwarder.avgCostPerKg * 10); // Scale cost
      const normalizedTime = Math.min(100, forwarder.avgTransitDays * 5); // Scale time
      const normalizedReliability = forwarder.reliabilityScore; // Already 0-100
      const normalizedRisk = forwarder.riskLevel; // Already 0-100

      topsis.addAlternative({
        id: forwarder.forwarder,
        name: forwarder.forwarder,
        values: {
          cost: normalizedCost,
          time: normalizedTime,
          reliability: normalizedReliability,
          risk: normalizedRisk
        }
      });
    });

    // Calculate TOPSIS ranking
    const ranking = topsis.calculate();
    const analysis = topsis.generateReport(ranking);

    const decision: DeepCALDecision = {
      ranking,
      criteriaWeights: weights,
      consistencyRatio,
      isConsistent,
      analysis,
      timestamp: new Date(),
      dataVersion: baseDataStore.getDataVersion()?.version || 'unknown'
    };

    // Save to Neon if enabled
    if (baseDataStore.isNeonEnabled()) {
      try {
        const analysisId = await neonDataService.saveAnalysis(decision);
        if (analysisId) {
          decision.analysisId = analysisId;
          console.log('💾 Analysis saved to Neon with ID:', analysisId);
        }
      } catch (error) {
        console.warn('⚠️ Failed to save analysis to Neon:', error);
      }
    }

    console.log('✅ DeepCAL decision completed');
    console.log('🏆 Top recommendation:', ranking[0]?.alternative.name);

    return decision;
  }

  // Enhanced performance update with Neon persistence
  async updatePerformance(shipmentId: string, actualTransitDays: number, actualCost: number, onTime: boolean): Promise<void> {
    console.log('🔄 Updating performance metrics for shipment:', shipmentId);
    
    // Update in Neon if enabled
    if (baseDataStore.isNeonEnabled()) {
      try {
        const success = await neonDataService.updateShipmentPerformance(
          shipmentId,
          actualTransitDays,
          actualCost,
          onTime
        );
        
        if (success) {
          console.log('✅ Performance updated in Neon');
          // Refresh local cache
          await baseDataStore.refreshFromNeon();
        }
      } catch (error) {
        console.warn('⚠️ Failed to update performance in Neon:', error);
      }
    }
    
    // Log performance update for audit trail
    console.log('📊 Performance update:', {
      shipmentId,
      actualTransitDays,
      actualCost,
      onTime,
      timestamp: new Date()
    });
  }

  // Updated method to get analysis history from Neon
  async getAnalysisHistory(limit = 10) {
    if (!baseDataStore.isNeonEnabled()) return [];
    
    try {
      return await neonDataService.getAnalysisHistory(limit);
    } catch (error) {
      console.error('❌ Failed to fetch analysis history:', error);
      return [];
    }
  }

  // Updated method for intelligent forwarder recommendations
  async getIntelligentRecommendations(query: string, limit = 5): Promise<ShipmentData[]> {
    if (!baseDataStore.isNeonEnabled()) return [];
    
    try {
      return await neonDataService.findSimilarShipments(query, limit);
    } catch (error) {
      console.error('❌ Failed to get intelligent recommendations:', error);
      return [];
    }
  }

  // Generate audit trail for decision traceability
  generateAuditTrail(decision: DeepCALDecision): string {
    let trail = "🔍 DEEPCAL DECISION AUDIT TRAIL\n";
    trail += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    trail += `📅 Timestamp: ${decision.timestamp.toISOString()}\n`;
    trail += `📦 Data Version: ${decision.dataVersion}\n`;
    trail += `🎯 Consistency Ratio: ${decision.consistencyRatio.toFixed(4)} ${decision.isConsistent ? '✅' : '❌'}\n`;
    
    if (decision.analysisId) {
      trail += `💾 Analysis ID: ${decision.analysisId}\n`;
    }
    
    trail += `🔗 Data Source: ${baseDataStore.isNeonEnabled() ? 'Neon Database' : 'In-Memory Store'}\n\n`;
    
    trail += "⚖️ CRITERIA WEIGHTS (Neutrosophic AHP):\n";
    trail += `  Cost: ${(decision.criteriaWeights.cost * 100).toFixed(2)}%\n`;
    trail += `  Time: ${(decision.criteriaWeights.time * 100).toFixed(2)}%\n`;
    trail += `  Reliability: ${(decision.criteriaWeights.reliability * 100).toFixed(2)}%\n`;
    trail += `  Risk: ${(decision.criteriaWeights.risk * 100).toFixed(2)}%\n\n`;
    
    trail += decision.analysis;
    
    return trail;
  }
}

export const deepcalCore = new DeepCALCore();
