
export interface NeutrosophicScore {
  truth: number;
  indeterminacy: number;
  falsity: number;
  crispScore: number;
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
  rank: number;
  neutrosophic: NeutrosophicScore;
  sha256Hash: string;
}

export class NeutrosophicEngine {
  private generateHash(data: string): string {
    // Simple hash generation for demonstration
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  calculateTOPSIS(forwarders: ForwarderData[], weights: WeightVector): TOPSISResult[] {
    // Normalize the decision matrix
    const normalizedMatrix = this.normalizeMatrix(forwarders);
    
    // Calculate weighted normalized matrix
    const weightedMatrix = this.applyWeights(normalizedMatrix, weights);
    
    // Find ideal and anti-ideal solutions
    const { ideal, antiIdeal } = this.findIdealSolutions(weightedMatrix);
    
    // Calculate distances and TOPSIS scores
    const results = forwarders.map((forwarder, index) => {
      const distanceToIdeal = this.calculateDistance(weightedMatrix[index], ideal);
      const distanceToAntiIdeal = this.calculateDistance(weightedMatrix[index], antiIdeal);
      
      const topsisScore = distanceToAntiIdeal / (distanceToIdeal + distanceToAntiIdeal);
      
      // Calculate neutrosophic components
      const truth = Math.min(forwarder.reliability / 100, topsisScore);
      const falsity = Math.max(forwarder.riskLevel / 100, 1 - topsisScore);
      const indeterminacy = Math.abs(truth - falsity) * 0.1;
      const crispScore = truth - falsity;
      
      const dataString = `${forwarder.name}-${topsisScore}-${Date.now()}`;
      
      return {
        forwarder: forwarder.name,
        normalizedScore: topsisScore,
        rank: 0, // Will be set after sorting
        neutrosophic: {
          truth,
          indeterminacy,
          falsity,
          crispScore
        },
        sha256Hash: this.generateHash(dataString)
      };
    });
    
    // Sort by TOPSIS score and assign ranks
    results.sort((a, b) => b.normalizedScore - a.normalizedScore);
    results.forEach((result, index) => {
      result.rank = index + 1;
    });
    
    return results;
  }

  private normalizeMatrix(forwarders: ForwarderData[]): number[][] {
    const matrix = forwarders.map(f => [f.costPerKg, f.transitDays, f.reliability, f.riskLevel]);
    const normalizedMatrix: number[][] = [];
    
    for (let i = 0; i < matrix.length; i++) {
      normalizedMatrix[i] = [];
      for (let j = 0; j < matrix[i].length; j++) {
        const sum = matrix.reduce((acc, row) => acc + Math.pow(row[j], 2), 0);
        normalizedMatrix[i][j] = matrix[i][j] / Math.sqrt(sum);
      }
    }
    
    return normalizedMatrix;
  }

  private applyWeights(matrix: number[][], weights: WeightVector): number[][] {
    const weightArray = [weights.cost, weights.time, weights.reliability, weights.risk];
    return matrix.map(row => row.map((value, index) => value * weightArray[index]));
  }

  private findIdealSolutions(matrix: number[][]): { ideal: number[], antiIdeal: number[] } {
    const ideal: number[] = [];
    const antiIdeal: number[] = [];
    
    for (let j = 0; j < matrix[0].length; j++) {
      const column = matrix.map(row => row[j]);
      // For cost and time (minimize), ideal is min, anti-ideal is max
      // For reliability (maximize), ideal is max, anti-ideal is min
      // For risk (minimize), ideal is min, anti-ideal is max
      if (j === 0 || j === 1 || j === 3) { // cost, time, risk - minimize
        ideal[j] = Math.min(...column);
        antiIdeal[j] = Math.max(...column);
      } else { // reliability - maximize
        ideal[j] = Math.max(...column);
        antiIdeal[j] = Math.min(...column);
      }
    }
    
    return { ideal, antiIdeal };
  }

  private calculateDistance(point: number[], reference: number[]): number {
    return Math.sqrt(point.reduce((sum, value, index) => 
      sum + Math.pow(value - reference[index], 2), 0));
  }
}
