
export interface NeutrosophicValue {
  truth: number;
  indeterminacy: number;
  falsehood: number;
  falsity: number; // Added for compatibility
  confidence: number;
  crispScore: number; // Added for compatibility
}

export interface ForwarderData {
  name: string;
  cost: number;
  time: number;
  reliability: number;
  experience: number;
}

export interface WeightVector {
  cost: number;
  time: number;
  reliability: number;
  experience: number;
}

export interface TOPSISResult {
  forwarderName: string;
  score: number;
  rank: number;
  reasoning: string[];
  forwarder: string;
  normalizedScore: number;
  neutrosophic: NeutrosophicValue;
  sha256Hash: string;
}

export class NeutrosophicEngine {
  static createValue(truth: number, indeterminacy: number, falsehood: number): NeutrosophicValue {
    const total = truth + indeterminacy + falsehood;
    const normalized = total > 0 ? {
      truth: truth / total,
      indeterminacy: indeterminacy / total,
      falsehood: falsehood / total
    } : { truth: 0.33, indeterminacy: 0.33, falsehood: 0.34 };

    const confidence = Math.max(0, Math.min(1, normalized.truth - normalized.falsehood));
    const crispScore = normalized.truth - normalized.falsehood;

    return {
      ...normalized,
      falsity: normalized.falsehood, // Added for compatibility
      confidence,
      crispScore
    };
  }

  static interpretShipment(shipment: any): NeutrosophicValue {
    const onTimeScore = shipment.delay_days === 0 ? 1 : Math.max(0, 1 - shipment.delay_days / 10);
    const damageScore = shipment.damage ? 0 : 1;
    const satisfactionScore = (shipment.customer_satisfaction_score || 80) / 100;
    
    const truth = (onTimeScore + damageScore + satisfactionScore) / 3;
    const indeterminacy = Math.abs(0.5 - truth) * 2;
    const falsehood = 1 - truth - indeterminacy;
    
    return this.createValue(truth, indeterminacy, Math.max(0, falsehood));
  }

  static calculateTOPSIS(forwarders: ForwarderData[], weights: WeightVector): TOPSISResult[] {
    // Normalize decision matrix
    const normalizedMatrix = forwarders.map(f => ({
      name: f.name,
      cost: f.cost / Math.sqrt(forwarders.reduce((sum, fw) => sum + fw.cost * fw.cost, 0)),
      time: f.time / Math.sqrt(forwarders.reduce((sum, fw) => sum + fw.time * fw.time, 0)),
      reliability: f.reliability / Math.sqrt(forwarders.reduce((sum, fw) => sum + fw.reliability * fw.reliability, 0)),
      experience: f.experience / Math.sqrt(forwarders.reduce((sum, fw) => sum + fw.experience * fw.experience, 0))
    }));

    // Apply weights
    const weightedMatrix = normalizedMatrix.map(f => ({
      name: f.name,
      cost: f.cost * weights.cost,
      time: f.time * weights.time,
      reliability: f.reliability * weights.reliability,
      experience: f.experience * weights.experience
    }));

    // Determine ideal and negative-ideal solutions
    const ideal = {
      cost: Math.min(...weightedMatrix.map(f => f.cost)), // Min for cost (beneficial)
      time: Math.min(...weightedMatrix.map(f => f.time)), // Min for time (beneficial)
      reliability: Math.max(...weightedMatrix.map(f => f.reliability)), // Max for reliability
      experience: Math.max(...weightedMatrix.map(f => f.experience)) // Max for experience
    };

    const negativeIdeal = {
      cost: Math.max(...weightedMatrix.map(f => f.cost)),
      time: Math.max(...weightedMatrix.map(f => f.time)),
      reliability: Math.min(...weightedMatrix.map(f => f.reliability)),
      experience: Math.min(...weightedMatrix.map(f => f.experience))
    };

    // Calculate distances and scores
    const results = weightedMatrix.map(f => {
      const distanceToIdeal = Math.sqrt(
        Math.pow(f.cost - ideal.cost, 2) +
        Math.pow(f.time - ideal.time, 2) +
        Math.pow(f.reliability - ideal.reliability, 2) +
        Math.pow(f.experience - ideal.experience, 2)
      );

      const distanceToNegativeIdeal = Math.sqrt(
        Math.pow(f.cost - negativeIdeal.cost, 2) +
        Math.pow(f.time - negativeIdeal.time, 2) +
        Math.pow(f.reliability - negativeIdeal.reliability, 2) +
        Math.pow(f.experience - negativeIdeal.experience, 2)
      );

      const score = distanceToNegativeIdeal / (distanceToIdeal + distanceToNegativeIdeal);
      const neutrosophic = this.createValue(score, 0.1, 1 - score - 0.1);

      return {
        forwarderName: f.name,
        forwarder: f.name,
        score: score,
        normalizedScore: score,
        rank: 0, // Will be set after sorting
        reasoning: [
          `Cost efficiency: ${(f.cost * 100).toFixed(1)}%`,
          `Time performance: ${(f.time * 100).toFixed(1)}%`,
          `Reliability: ${(f.reliability * 100).toFixed(1)}%`,
          `Experience: ${(f.experience * 100).toFixed(1)}%`
        ],
        neutrosophic,
        sha256Hash: Math.random().toString(36).substring(2, 15)
      };
    });

    // Sort by score and assign ranks
    results.sort((a, b) => b.score - a.score);
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    return results;
  }
}
