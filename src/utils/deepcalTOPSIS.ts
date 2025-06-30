
import { baseDataStore } from '@/services/baseDataStore';

export interface TOPSISCriteria {
  name: string;
  weight: number;
  beneficial: boolean; // true for maximize, false for minimize
}

export interface TOPSISAlternative {
  id: string;
  name: string;
  values: Record<string, number>;
}

export interface TOPSISResult {
  alternative: TOPSISAlternative;
  closenessCoefficient: number;
  rank: number;
  distanceToIdeal: number;
  distanceToAntiIdeal: number;
  normalizedValues: Record<string, number>;
  weightedValues: Record<string, number>;
}

export class DeepCALTOPSIS {
  private criteria: TOPSISCriteria[];
  private alternatives: TOPSISAlternative[];

  constructor(criteria: TOPSISCriteria[]) {
    baseDataStore.enforceDataLock(); // Enforce data-first protocol
    this.criteria = criteria;
    this.alternatives = [];
  }

  addAlternative(alternative: TOPSISAlternative): void {
    this.alternatives.push(alternative);
  }

  calculate(): TOPSISResult[] {
    if (this.alternatives.length === 0) {
      throw new Error('No alternatives provided for TOPSIS analysis');
    }

    console.log('🔬 TOPSIS Analysis Started');
    console.log('📊 Criteria:', this.criteria);
    console.log('🎯 Alternatives:', this.alternatives.length);

    // Step 1: Build decision matrix
    const decisionMatrix = this.buildDecisionMatrix();
    
    // Step 2: Normalize the decision matrix
    const normalizedMatrix = this.normalizeMatrix(decisionMatrix);
    
    // Step 3: Apply weights
    const weightedMatrix = this.applyWeights(normalizedMatrix);
    
    // Step 4: Find ideal and anti-ideal solutions
    const { ideal, antiIdeal } = this.findIdealSolutions(weightedMatrix);
    
    // Step 5: Calculate distances
    const results = this.calculateDistancesAndRanking(
      weightedMatrix, 
      normalizedMatrix, 
      ideal, 
      antiIdeal
    );

    console.log('✅ TOPSIS Analysis Complete');
    console.log('🏆 Rankings:', results.map(r => ({ name: r.alternative.name, rank: r.rank, score: r.closenessCoefficient })));

    return results;
  }

  private buildDecisionMatrix(): number[][] {
    const matrix: number[][] = [];
    
    for (const alternative of this.alternatives) {
      const row: number[] = [];
      for (const criterion of this.criteria) {
        const value = alternative.values[criterion.name];
        if (value === undefined || value === null) {
          throw new Error(`Missing value for criterion '${criterion.name}' in alternative '${alternative.name}'`);
        }
        row.push(value);
      }
      matrix.push(row);
    }
    
    return matrix;
  }

  private normalizeMatrix(matrix: number[][]): number[][] {
    const normalizedMatrix: number[][] = [];
    const m = matrix.length; // alternatives
    const n = matrix[0].length; // criteria

    // Calculate column norms (Euclidean normalization)
    const columnNorms: number[] = [];
    for (let j = 0; j < n; j++) {
      let sumSquares = 0;
      for (let i = 0; i < m; i++) {
        sumSquares += matrix[i][j] ** 2;
      }
      columnNorms[j] = Math.sqrt(sumSquares);
    }

    // Normalize each element
    for (let i = 0; i < m; i++) {
      const row: number[] = [];
      for (let j = 0; j < n; j++) {
        const normalized = columnNorms[j] !== 0 ? matrix[i][j] / columnNorms[j] : 0;
        row.push(normalized);
      }
      normalizedMatrix.push(row);
    }

    return normalizedMatrix;
  }

  private applyWeights(normalizedMatrix: number[][]): number[][] {
    const weightedMatrix: number[][] = [];
    
    for (let i = 0; i < normalizedMatrix.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < normalizedMatrix[i].length; j++) {
        row.push(normalizedMatrix[i][j] * this.criteria[j].weight);
      }
      weightedMatrix.push(row);
    }

    return weightedMatrix;
  }

  private findIdealSolutions(weightedMatrix: number[][]): {
    ideal: number[];
    antiIdeal: number[];
  } {
    const n = this.criteria.length;
    const ideal: number[] = [];
    const antiIdeal: number[] = [];

    for (let j = 0; j < n; j++) {
      const column = weightedMatrix.map(row => row[j]);
      const criterion = this.criteria[j];

      if (criterion.beneficial) {
        // Maximize: ideal = max, anti-ideal = min
        ideal[j] = Math.max(...column);
        antiIdeal[j] = Math.min(...column);
      } else {
        // Minimize: ideal = min, anti-ideal = max
        ideal[j] = Math.min(...column);
        antiIdeal[j] = Math.max(...column);
      }
    }

    console.log('🎯 Ideal solution:', ideal);
    console.log('❌ Anti-ideal solution:', antiIdeal);

    return { ideal, antiIdeal };
  }

  private calculateDistancesAndRanking(
    weightedMatrix: number[][],
    normalizedMatrix: number[][],
    ideal: number[],
    antiIdeal: number[]
  ): TOPSISResult[] {
    const results: TOPSISResult[] = [];

    for (let i = 0; i < this.alternatives.length; i++) {
      const alternative = this.alternatives[i];
      const weightedRow = weightedMatrix[i];
      const normalizedRow = normalizedMatrix[i];

      // Calculate Euclidean distances
      let distanceToIdeal = 0;
      let distanceToAntiIdeal = 0;

      for (let j = 0; j < weightedRow.length; j++) {
        distanceToIdeal += (weightedRow[j] - ideal[j]) ** 2;
        distanceToAntiIdeal += (weightedRow[j] - antiIdeal[j]) ** 2;
      }

      distanceToIdeal = Math.sqrt(distanceToIdeal);
      distanceToAntiIdeal = Math.sqrt(distanceToAntiIdeal);

      // Calculate closeness coefficient
      const closenessCoefficient = distanceToAntiIdeal / (distanceToIdeal + distanceToAntiIdeal);

      // Build normalized and weighted values objects
      const normalizedValues: Record<string, number> = {};
      const weightedValues: Record<string, number> = {};
      
      for (let j = 0; j < this.criteria.length; j++) {
        const criterionName = this.criteria[j].name;
        normalizedValues[criterionName] = normalizedRow[j];
        weightedValues[criterionName] = weightedRow[j];
      }

      results.push({
        alternative,
        closenessCoefficient,
        rank: 0, // Will be set after sorting
        distanceToIdeal,
        distanceToAntiIdeal,
        normalizedValues,
        weightedValues
      });
    }

    // Sort by closeness coefficient (descending) and assign ranks
    results.sort((a, b) => b.closenessCoefficient - a.closenessCoefficient);
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    return results;
  }

  // Generate detailed analysis report
  generateReport(results: TOPSISResult[]): string {
    let report = "📊 DEEPCAL TOPSIS ANALYSIS REPORT\n";
    report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    report += "🎯 CRITERIA WEIGHTS:\n";
    this.criteria.forEach(criterion => {
      const type = criterion.beneficial ? "↗️ (Maximize)" : "↘️ (Minimize)";
      report += `  ${criterion.name}: ${(criterion.weight * 100).toFixed(1)}% ${type}\n`;
    });
    
    report += "\n🏆 FINAL RANKINGS:\n";
    results.forEach(result => {
      report += `  ${result.rank}. ${result.alternative.name}\n`;
      report += `     Closeness: ${(result.closenessCoefficient * 100).toFixed(2)}%\n`;
      report += `     Distance to Ideal: ${result.distanceToIdeal.toFixed(4)}\n`;
      report += `     Distance to Anti-Ideal: ${result.distanceToAntiIdeal.toFixed(4)}\n\n`;
    });

    return report;
  }
}
