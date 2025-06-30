
export interface NeutrosophicValue {
  truth: number;
  indeterminacy: number;
  falsehood: number;
}

export interface ForwarderData {
  name: string;
  costPerKg: number;
  transitDays: number;
  reliability: number;
  riskLevel: number;
}

export interface WeightVector {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
}

export interface TOPSISResult {
  forwarder: string;
  normalizedScore: number;
  neutrosophic: NeutrosophicValue & { crispScore: number };
  rank: number;
  sha256Hash: string;
}

export const createNeutrosophicValue = (truth: number, indeterminacy: number, falsehood: number): NeutrosophicValue => {
  return { truth, indeterminacy, falsehood };
};

export class NeutrosophicEngine {
  calculateTOPSIS(forwarders: ForwarderData[], weights: WeightVector): TOPSISResult[] {
    // Simple TOPSIS implementation for demo purposes
    const results = forwarders.map((forwarder, index) => {
      // Normalize and calculate scores (simplified)
      const costScore = 1 / forwarder.costPerKg;
      const timeScore = 1 / forwarder.transitDays;
      const reliabilityScore = forwarder.reliability / 100;
      const riskScore = 1 / forwarder.riskLevel;
      
      const normalizedScore = (
        weights.cost * costScore +
        weights.time * timeScore +
        weights.reliability * reliabilityScore +
        weights.risk * riskScore
      ) / (weights.cost + weights.time + weights.reliability + weights.risk);
      
      const truth = Math.min(1, normalizedScore + 0.1);
      const indeterminacy = Math.random() * 0.2;
      const falsehood = Math.max(0, 1 - truth - indeterminacy);
      const crispScore = truth - falsehood;
      
      return {
        forwarder: forwarder.name,
        normalizedScore,
        neutrosophic: {
          truth,
          indeterminacy,
          falsehood,
          crispScore
        },
        rank: 0, // Will be set after sorting
        sha256Hash: `hash_${Date.now()}_${index}`
      };
    });
    
    // Sort by normalized score and assign ranks
    return results
      .sort((a, b) => b.normalizedScore - a.normalizedScore)
      .map((result, index) => ({ ...result, rank: index + 1 }));
  }
}
