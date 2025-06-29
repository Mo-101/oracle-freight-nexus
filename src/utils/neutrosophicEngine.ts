
export interface NeutrosophicValue {
  truth: number;
  indeterminacy: number;
  falsehood: number;
  confidence: number;
}

export class NeutrosophicEngine {
  static createValue(truth: number, indeterminacy: number, falsehood: number): NeutrosophicValue {
    const total = truth + indeterminacy + falsehood;
    const normalized = total > 0 ? {
      truth: truth / total,
      indeterminacy: indeterminacy / total,
      falsehood: falsehood / total
    } : { truth: 0.33, indeterminacy: 0.33, falsehood: 0.34 };

    return {
      ...normalized,
      confidence: Math.max(0, Math.min(1, normalized.truth - normalized.falsehood))
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
}
