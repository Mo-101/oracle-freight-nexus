
export class TNN {
  public T: number; // Truth
  public I: number; // Indeterminacy
  public F: number; // Falsity

  constructor(T: number, I: number, F: number) {
    this.T = Math.max(0, Math.min(1, T));
    this.I = Math.max(0, Math.min(1, I));
    this.F = Math.max(0, Math.min(1, F));
    
    // Ensure T + I + F ≤ 3 (neutrosophic constraint)
    const sum = this.T + this.I + this.F;
    if (sum > 3) {
      const factor = 3 / sum;
      this.T *= factor;
      this.I *= factor;
      this.F *= factor;
    }
  }

  score(): number {
    // Score function: S(N) = T - F
    return this.T - this.F;
  }

  multiply(other: TNN): TNN {
    return new TNN(
      this.T * other.T,
      this.I + other.I - this.I * other.I,
      this.F + other.F - this.F * other.F
    );
  }

  add(other: TNN): TNN {
    return new TNN(
      this.T + other.T - this.T * other.T,
      this.I * other.I,
      this.F * other.F
    );
  }

  static fromValue(value: number): TNN {
    // Convert crisp value to TNN
    if (value >= 1) return new TNN(1, 0, 0);
    if (value <= 0) return new TNN(0, 0, 1);
    return new TNN(value, 0.1, 1 - value);
  }
}

export interface NeutrosophicAHPOptions {
  consistencyThreshold: number; // CR < 0.1 (Saaty's threshold)
  maxIterations: number;
}

export class NeutrosophicAHP {
  private options: NeutrosophicAHPOptions;

  constructor(options: Partial<NeutrosophicAHPOptions> = {}) {
    this.options = {
      consistencyThreshold: 0.1,
      maxIterations: 100,
      ...options
    };
  }

  // Saaty's Random Consistency Index
  private getRandomIndex(n: number): number {
    const RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
    return n < RI.length ? RI[n] : 1.49;
  }

  calculateWeights(pairwiseMatrix: TNN[][]): {
    weights: number[];
    consistencyRatio: number;
    isConsistent: boolean;
  } {
    const n = pairwiseMatrix.length;
    
    // Convert TNN matrix to crisp values using score function
    const crispMatrix = pairwiseMatrix.map(row => 
      row.map(tnn => Math.max(0.111, tnn.score() + 1)) // Ensure positive values
    );

    // Calculate eigenvalues and eigenvectors
    const weights = this.calculateEigenVector(crispMatrix);
    const lambdaMax = this.calculateLambdaMax(crispMatrix, weights);
    
    // Consistency check
    const CI = (lambdaMax - n) / (n - 1);
    const RI = this.getRandomIndex(n);
    const CR = CI / RI;

    console.log('🧮 AHP Analysis:', {
      lambdaMax,
      CI,
      RI,
      CR,
      weights,
      isConsistent: CR < this.options.consistencyThreshold
    });

    return {
      weights: this.normalizeWeights(weights),
      consistencyRatio: CR,
      isConsistent: CR < this.options.consistencyThreshold
    };
  }

  private calculateEigenVector(matrix: number[][]): number[] {
    const n = matrix.length;
    let weights = new Array(n).fill(1); // Initial guess

    // Power method for principal eigenvector
    for (let iter = 0; iter < this.options.maxIterations; iter++) {
      const newWeights = new Array(n).fill(0);
      
      // Matrix multiplication
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          newWeights[i] += matrix[i][j] * weights[j];
        }
      }

      // Normalize
      const sum = newWeights.reduce((a, b) => a + b, 0);
      for (let i = 0; i < n; i++) {
        newWeights[i] /= sum;
      }

      // Check convergence
      const diff = newWeights.reduce((acc, val, i) => 
        acc + Math.abs(val - weights[i]), 0
      );
      
      weights = newWeights;
      
      if (diff < 1e-6) break;
    }

    return weights;
  }

  private calculateLambdaMax(matrix: number[][], weights: number[]): number {
    const n = matrix.length;
    let lambdaMax = 0;

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += matrix[i][j] * weights[j];
      }
      lambdaMax += sum / weights[i];
    }

    return lambdaMax / n;
  }

  private normalizeWeights(weights: number[]): number[] {
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map(w => w / sum);
  }

  // Helper method to create pairwise comparison from judgments
  createPairwiseMatrix(criteria: string[], judgments: Record<string, TNN>): TNN[][] {
    const n = criteria.length;
    const matrix: TNN[][] = Array(n).fill(null).map(() => Array(n).fill(null));

    // Fill diagonal with (1, 0, 0)
    for (let i = 0; i < n; i++) {
      matrix[i][i] = new TNN(1, 0, 0);
    }

    // Fill upper triangle with judgments
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const key = `${criteria[i]}-${criteria[j]}`;
        const judgment = judgments[key] || new TNN(1, 0, 0);
        matrix[i][j] = judgment;
        
        // Reciprocal for lower triangle
        const reciprocal = new TNN(judgment.F, judgment.I, judgment.T);
        matrix[j][i] = reciprocal;
      }
    }

    return matrix;
  }
}
