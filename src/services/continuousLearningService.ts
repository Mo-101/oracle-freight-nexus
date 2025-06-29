
import { CanonicalShipment } from '@/types/freight';

interface FeedbackEntry {
  id: string;
  timestamp: Date;
  query: string;
  response: string;
  userFeedback: 'positive' | 'negative' | 'neutral';
  corrections?: string;
  actualOutcome?: Partial<CanonicalShipment>;
  shipmentId?: number;
}

interface LearningMetrics {
  totalFeedback: number;
  positiveRate: number;
  commonErrors: string[];
  improvementAreas: string[];
  retrainingRecommended: boolean;
}

class ContinuousLearningService {
  private feedbackStore: FeedbackEntry[] = [];
  private learningThreshold = 100; // Retrain after 100 feedback entries

  // Collect user feedback
  recordFeedback(feedback: Omit<FeedbackEntry, 'id' | 'timestamp'>): string {
    const entry: FeedbackEntry = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...feedback
    };

    this.feedbackStore.push(entry);
    this.saveFeedbackToStorage();
    
    // Check if retraining is needed
    if (this.shouldRetrain()) {
      this.triggerRetrainingAlert();
    }

    return entry.id;
  }

  // Record actual shipment outcomes for learning
  recordShipmentOutcome(shipmentId: number, actualOutcome: Partial<CanonicalShipment>): void {
    const feedback: FeedbackEntry = {
      id: `outcome_${shipmentId}_${Date.now()}`,
      timestamp: new Date(),
      query: `Shipment ${shipmentId} actual outcome`,
      response: 'Predicted outcome vs actual',
      userFeedback: 'neutral',
      actualOutcome,
      shipmentId
    };

    this.feedbackStore.push(feedback);
    this.saveFeedbackToStorage();
  }

  // Analyze learning metrics
  analyzePerformance(): LearningMetrics {
    const totalFeedback = this.feedbackStore.length;
    const positiveFeedback = this.feedbackStore.filter(f => f.userFeedback === 'positive').length;
    const negativeFeedback = this.feedbackStore.filter(f => f.userFeedback === 'negative').length;
    
    const positiveRate = totalFeedback > 0 ? (positiveFeedback / totalFeedback) * 100 : 0;

    // Analyze common errors from negative feedback
    const commonErrors = this.extractCommonErrors();
    const improvementAreas = this.identifyImprovementAreas();
    const retrainingRecommended = this.shouldRetrain();

    return {
      totalFeedback,
      positiveRate,
      commonErrors,
      improvementAreas,
      retrainingRecommended
    };
  }

  // Extract patterns from feedback for retraining
  generateRetrainingData(): Array<{prompt: string, response: string, quality: number}> {
    const retrainingData: Array<{prompt: string, response: string, quality: number}> = [];

    this.feedbackStore.forEach(feedback => {
      if (feedback.userFeedback === 'negative' && feedback.corrections) {
        // Use corrected response for retraining
        retrainingData.push({
          prompt: feedback.query,
          response: feedback.corrections,
          quality: 1.0 // High quality corrected response
        });
      } else if (feedback.userFeedback === 'positive') {
        // Reinforce positive responses
        retrainingData.push({
          prompt: feedback.query,
          response: feedback.response,
          quality: 0.8 // Good quality response
        });
      }

      // Learn from actual outcomes
      if (feedback.actualOutcome && feedback.shipmentId) {
        const outcomePrompt = `What would be the actual outcome for shipment ${feedback.shipmentId}?`;
        const outcomeResponse = this.formatActualOutcome(feedback.actualOutcome);
        
        retrainingData.push({
          prompt: outcomePrompt,
          response: outcomeResponse,
          quality: 1.0 // Highest quality - real world data
        });
      }
    });

    return retrainingData;
  }

  // Export feedback data for analysis
  exportFeedbackData(): string {
    const exportData = {
      metadata: {
        totalEntries: this.feedbackStore.length,
        dateRange: {
          from: this.feedbackStore.length > 0 ? this.feedbackStore[0].timestamp : null,
          to: this.feedbackStore.length > 0 ? this.feedbackStore[this.feedbackStore.length - 1].timestamp : null
        },
        metrics: this.analyzePerformance()
      },
      feedback: this.feedbackStore
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Check if model should be retrained
  private shouldRetrain(): boolean {
    if (this.feedbackStore.length < this.learningThreshold) return false;
    
    const recentFeedback = this.feedbackStore.slice(-this.learningThreshold);
    const negativeRate = recentFeedback.filter(f => f.userFeedback === 'negative').length / recentFeedback.length;
    
    // Retrain if negative feedback > 30% or significant corrections available
    return negativeRate > 0.3 || this.hasSignificantCorrections();
  }

  private hasSignificantCorrections(): boolean {
    const correctionsCount = this.feedbackStore.filter(f => f.corrections).length;
    return correctionsCount >= 20; // Threshold for significant corrections
  }

  private extractCommonErrors(): string[] {
    const errors: Record<string, number> = {};
    
    this.feedbackStore
      .filter(f => f.userFeedback === 'negative')
      .forEach(feedback => {
        // Simple error pattern extraction
        if (feedback.corrections) {
          const errorPattern = this.categorizeError(feedback.query, feedback.response, feedback.corrections);
          errors[errorPattern] = (errors[errorPattern] || 0) + 1;
        }
      });

    return Object.entries(errors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([error]) => error);
  }

  private categorizeError(query: string, response: string, correction: string): string {
    // Simple error categorization logic
    if (query.includes('cost') && correction.includes('cost')) return 'Cost estimation errors';
    if (query.includes('time') && correction.includes('time')) return 'Transit time errors';
    if (query.includes('route') && correction.includes('route')) return 'Route recommendation errors';
    if (query.includes('risk') && correction.includes('risk')) return 'Risk assessment errors';
    return 'General accuracy issues';
  }

  private identifyImprovementAreas(): string[] {
    const areas = new Set<string>();
    
    this.feedbackStore.forEach(feedback => {
      if (feedback.userFeedback === 'negative') {
        if (feedback.query.includes('cost')) areas.add('Cost estimation');
        if (feedback.query.includes('time')) areas.add('Transit time prediction');
        if (feedback.query.includes('route')) areas.add('Route optimization');
        if (feedback.query.includes('risk')) areas.add('Risk assessment');
        if (feedback.query.includes('carrier')) areas.add('Carrier selection');
      }
    });

    return Array.from(areas);
  }

  private formatActualOutcome(outcome: Partial<CanonicalShipment>): string {
    const parts = [];
    
    if (outcome.transit_days) parts.push(`Transit time: ${outcome.transit_days} days`);
    if (outcome.actual_cost) parts.push(`Actual cost: $${outcome.actual_cost}`);
    if (outcome.delay_days) parts.push(`Delays: ${outcome.delay_days} days`);
    if (outcome.damage) parts.push('Damage occurred');
    if (outcome.customer_satisfaction_score) parts.push(`Satisfaction: ${outcome.customer_satisfaction_score}%`);
    
    return parts.join(', ');
  }

  private triggerRetrainingAlert(): void {
    console.log('🔄 Retraining recommended based on feedback analysis');
    // In production, this would trigger a retraining pipeline
    
    // Emit event for UI notification
    window.dispatchEvent(new CustomEvent('deepcal-retrain-recommended', {
      detail: { metrics: this.analyzePerformance() }
    }));
  }

  private saveFeedbackToStorage(): void {
    try {
      localStorage.setItem('deepcal_feedback', JSON.stringify(this.feedbackStore));
    } catch (error) {
      console.warn('Failed to save feedback to localStorage:', error);
    }
  }

  private loadFeedbackFromStorage(): void {
    try {
      const stored = localStorage.getItem('deepcal_feedback');
      if (stored) {
        this.feedbackStore = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load feedback from localStorage:', error);
    }
  }

  constructor() {
    this.loadFeedbackFromStorage();
  }
}

export const continuousLearningService = new ContinuousLearningService();
