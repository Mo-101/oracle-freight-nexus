
import { ForwarderIntelligence, DynamicRankingConfig, RealTimeRate } from '@/types/freight';
import { safeParseNumber } from './dataTypeUtils';
import { realRateService } from '@/services/realRateService';

export class DynamicRankingEngine {
  
  // Generate real-time rates based on canonical data and market adjustments
  private generateRealTimeRate(forwarderName: string, origin: string = 'Kenya', destination: string = 'Zimbabwe', weight: number = 1000): RealTimeRate {
    return realRateService.generateRealTimeRate(forwarderName, origin, destination, weight);
  }

  // Calculate dynamic score based on multiple criteria
  private calculateDynamicScore(
    forwarder: ForwarderIntelligence, 
    config: DynamicRankingConfig
  ): number {
    const { costWeight, timeWeight, reliabilityWeight, riskWeight, emergencyMode } = config;
    
    // Normalize scores (0-1 scale)
    const costScore = Math.max(0, 1 - (forwarder.realTimeRate?.totalRate || forwarder.avgCostPerKg) / 10);
    const timeScore = Math.max(0, 1 - forwarder.avgTransitDays / 14);
    const reliabilityScore = forwarder.reliabilityScore / 100;
    const riskScore = forwarder.successRate / 100;
    
    // Emergency mode adjustments
    let emergencyBonus = 0;
    if (emergencyMode && forwarder.emergencyGrade === 'Critical') {
      emergencyBonus = 0.2;
    } else if (emergencyMode && forwarder.emergencyGrade === 'Priority') {
      emergencyBonus = 0.1;
    }
    
    // Calculate weighted score
    const score = (
      costScore * costWeight +
      timeScore * timeWeight +
      reliabilityScore * reliabilityWeight +
      riskScore * riskWeight
    ) + emergencyBonus;
    
    return Math.min(1, Math.max(0, score));
  }

  // Main ranking function
  public rankForwarders(
    forwarders: ForwarderIntelligence[], 
    config: DynamicRankingConfig,
    route?: { origin: string; destination: string; weight?: number }
  ): ForwarderIntelligence[] {
    
    // Generate real-time rates for all forwarders
    const forwardersWithRates = forwarders.map(forwarder => ({
      ...forwarder,
      realTimeRate: this.generateRealTimeRate(
        forwarder.name, 
        route?.origin || 'Kenya', 
        route?.destination || 'Zimbabwe', 
        route?.weight || 1000
      )
    }));
    
    // Calculate dynamic scores
    const scoredForwarders = forwardersWithRates.map(forwarder => ({
      ...forwarder,
      dynamicScore: this.calculateDynamicScore(forwarder, config)
    }));
    
    // Sort by dynamic score (highest first)
    const rankedForwarders = scoredForwarders.sort((a, b) => 
      (b.dynamicScore || 0) - (a.dynamicScore || 0)
    );
    
    // Assign rank positions
    return rankedForwarders.map((forwarder, index) => ({
      ...forwarder,
      rankPosition: index + 1
    }));
  }

  // Get default configuration
  public getDefaultConfig(): DynamicRankingConfig {
    return {
      costWeight: 0.35,
      timeWeight: 0.25,
      reliabilityWeight: 0.25,
      riskWeight: 0.15,
      emergencyMode: false
    };
  }

  // Preset configurations for different scenarios
  public getPresetConfigs() {
    return {
      costOptimized: {
        costWeight: 0.5,
        timeWeight: 0.2,
        reliabilityWeight: 0.2,
        riskWeight: 0.1,
        emergencyMode: false
      },
      timeOptimized: {
        costWeight: 0.2,
        timeWeight: 0.5,
        reliabilityWeight: 0.2,
        riskWeight: 0.1,
        emergencyMode: false
      },
      emergency: {
        costWeight: 0.15,
        timeWeight: 0.4,
        reliabilityWeight: 0.3,
        riskWeight: 0.15,
        emergencyMode: true
      },
      balanced: {
        costWeight: 0.25,
        timeWeight: 0.25,
        reliabilityWeight: 0.25,
        riskWeight: 0.25,
        emergencyMode: false
      }
    };
  }
}

export const dynamicRankingEngine = new DynamicRankingEngine();
