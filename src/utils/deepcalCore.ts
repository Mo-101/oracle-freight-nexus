import { baseDataStore } from '@/services/baseDataStore';
import { neonDataService } from '@/services/neonDataService';
import { canonicalShipmentData } from '@/data/canonicalData';
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
  riskScore: number;
  totalShipments: number;
  onTimeDeliveryRate: number;
}

export interface DeepCALDecision {
  ranking: TOPSISResult[];
  criteriaWeights: DeepCALCriteria;
  consistencyRatio: number;
  isConsistent: boolean;
  analysis: string;
  timestamp: Date;
  dataVersion: string;
  analysisId?: string;
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
  private useNeon: boolean = true;

  constructor() {
    console.log('🚀 DeepCAL: Initializing with canonical data foundation');
    this.ahp = new NeutrosophicAHP({
      consistencyThreshold: 0.1,
      maxIterations: 100
    });
  }

  async analyzeForwarders(): Promise<ForwarderAnalysis[]> {
    console.log('🔍 DeepCAL: Analyzing forwarders from canonical data...');
    
    const forwarderGroups = new Map<string, any[]>();
    
    // Helper to calculate transit days
    const calculateTransitDays = (collectionDate: string, arrivalDate: string): number => {
      if (!collectionDate || !arrivalDate) return 0;
      const collection = new Date(collectionDate);
      const arrival = new Date(arrivalDate);
      const diffTime = Math.abs(arrival.getTime() - collection.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    
    // Extract actual shipment data per forwarder from canonical data
    canonicalShipmentData.forEach(shipment => {
      const forwarders = [
        { name: 'Kuehne Nagel', cost: Number(shipment.kuehne_nagel) || 0 },
        { name: 'Scan Global Logistics', cost: Number(shipment.scan_global_logistics) || 0 },
        { name: 'DHL Express', cost: Number(shipment.dhl_express) || 0 },
        { name: 'DHL Global', cost: Number(shipment.dhl_global) || 0 },
        { name: 'BWOSI', cost: Number(shipment.bwosi) || 0 },
        { name: 'AGL', cost: Number(shipment.agl) || 0 },
        { name: 'Siginon', cost: Number(shipment.siginon) || 0 },
        { name: 'Freight in Time', cost: Number(shipment.freight_in_time) || 0 }
      ];
      
      forwarders.forEach(({ name, cost }) => {
        if (cost > 0) {
          if (!forwarderGroups.has(name)) {
            forwarderGroups.set(name, []);
          }
          
          const transitDays = calculateTransitDays(shipment.date_of_collection, shipment.date_of_arrival_destination);
          
          forwarderGroups.get(name)!.push({
            ...shipment,
            actualCost: cost,
            transitDays,
            onTime: transitDays <= 7,
            delivered: shipment.delivery_status === 'Delivered'
          });
        }
      });
    });
    
    // Calculate real metrics from actual canonical data
    const analyses: ForwarderAnalysis[] = [];
    
    forwarderGroups.forEach((shipmentList, forwarderName) => {
      const totalShipments = shipmentList.length;
      if (totalShipments === 0) return;
      
      const avgCost = shipmentList.reduce((sum, s) => sum + (s.actualCost / (Number(s.weight_kg) || 1)), 0) / totalShipments;
      const avgTransit = shipmentList.reduce((sum, s) => sum + s.transitDays, 0) / totalShipments;
      const deliveredCount = shipmentList.filter(s => s.delivered).length;
      const onTimeCount = shipmentList.filter(s => s.onTime).length;
      
      analyses.push({
        forwarder: forwarderName,
        avgCostPerKg: Number(avgCost.toFixed(2)),
        avgTransitDays: Number(avgTransit.toFixed(1)),
        reliabilityScore: Number(((deliveredCount / totalShipments) * 100).toFixed(1)),
        totalShipments,
        onTimeDeliveryRate: Number(((onTimeCount / totalShipments) * 100).toFixed(1)),
        riskScore: Number((100 - (deliveredCount / totalShipments) * 100).toFixed(1))
      });
    });
    
    console.log(`✅ DeepCAL: Analyzed ${analyses.length} forwarders from canonical data`);
    analyses.forEach(a => console.log(`📊 ${a.forwarder}: ${a.totalShipments} shipments, $${a.avgCostPerKg}/kg, ${a.avgTransitDays} days`));
    
    return analyses;
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
    
    const defaultJudgments = userJudgments || {
      'cost-time': new TNN(0.7, 0.2, 0.1),
      'cost-reliability': new TNN(0.4, 0.3, 0.3),
      'cost-risk': new TNN(0.6, 0.2, 0.2),
      'time-reliability': new TNN(0.3, 0.3, 0.4),
      'time-risk': new TNN(0.5, 0.3, 0.2),
      'reliability-risk': new TNN(0.8, 0.1, 0.1)
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
    
    const allForwarders = await this.analyzeForwarders();
    const targetForwarders = forwarders ? 
      allForwarders.filter(f => forwarders.includes(f.forwarder)) : 
      allForwarders.slice(0, 8);

    if (targetForwarders.length === 0) {
      throw new Error('No forwarders found for analysis');
    }

    const { weights, consistencyRatio, isConsistent } = this.calculateCriteriaWeights();

    const topsis = new DeepCALTOPSIS([
      { name: 'cost', weight: weights.cost, beneficial: false },
      { name: 'time', weight: weights.time, beneficial: false },
      { name: 'reliability', weight: weights.reliability, beneficial: true },
      { name: 'risk', weight: weights.risk, beneficial: false }
    ]);

    targetForwarders.forEach(forwarder => {
      const normalizedCost = Math.min(100, forwarder.avgCostPerKg * 10);
      const normalizedTime = Math.min(100, forwarder.avgTransitDays * 5);
      const normalizedReliability = forwarder.reliabilityScore;
      const normalizedRisk = forwarder.riskScore;

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

    const ranking = topsis.calculate();
    const analysis = topsis.generateReport(ranking);

    const decision: DeepCALDecision = {
      ranking,
      criteriaWeights: weights,
      consistencyRatio,
      isConsistent,
      analysis,
      timestamp: new Date(),
      dataVersion: 'canonical-v1.0'
    };

    console.log('✅ DeepCAL decision completed');
    console.log('🏆 Top recommendation:', ranking[0]?.alternative.name);

    return decision;
  }

  async updatePerformance(shipmentId: string, actualTransitDays: number, actualCost: number, onTime: boolean): Promise<void> {
    console.log('🔄 Updating performance metrics for shipment:', shipmentId);
    
    if (this.useNeon) {
      try {
        const success = await neonDataService.updateShipmentPerformance(
          shipmentId,
          actualTransitDays,
          actualCost,
          onTime
        );
        
        if (success) {
          console.log('✅ Performance updated in Neon');
        }
      } catch (error) {
        console.warn('⚠️ Failed to update performance in Neon:', error);
      }
    }
  }

  async getAnalysisHistory(limit = 10) {
    if (!this.useNeon) return [];
    
    try {
      return await neonDataService.getAnalysisHistory(limit);
    } catch (error) {
      console.error('❌ Failed to fetch analysis history:', error);
      return [];
    }
  }

  async getIntelligentRecommendations(query: string, limit = 5): Promise<ShipmentData[]> {
    if (!this.useNeon) return [];
    
    try {
      return await neonDataService.findSimilarShipments(query, limit);
    } catch (error) {
      console.error('❌ Failed to get intelligent recommendations:', error);
      return [];
    }
  }

  generateAuditTrail(decision: DeepCALDecision): string {
    let trail = "🔍 DEEPCAL DECISION AUDIT TRAIL\n";
    trail += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    trail += `📅 Timestamp: ${decision.timestamp.toISOString()}\n`;
    trail += `📦 Data Version: ${decision.dataVersion}\n`;
    trail += `🎯 Consistency Ratio: ${decision.consistencyRatio.toFixed(4)} ${decision.isConsistent ? '✅' : '❌'}\n\n`;
    
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