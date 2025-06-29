
import { canonicalShipmentData } from '@/data/canonicalData';
import { syntheticDataGenerator } from './syntheticDataGenerator';
import { CanonicalShipment } from '@/types/freight';

interface ExportConfig {
  includeCanonical: boolean;
  syntheticCount: number;
  includeWestAfrica: boolean;
  includeNorthAfrica: boolean;
  includeCentralAfrica: boolean;
  includeEdgeCases: boolean;
  exportFormat: 'jsonl' | 'csv' | 'json';
}

class DataExportService {
  async exportForFineTuning(config: ExportConfig): Promise<string> {
    let allData: CanonicalShipment[] = [];

    // Include canonical data if requested
    if (config.includeCanonical) {
      allData.push(...canonicalShipmentData);
    }

    // Generate synthetic data if requested
    if (config.syntheticCount > 0) {
      const syntheticData = syntheticDataGenerator.generateSyntheticData({
        count: config.syntheticCount,
        includeWestAfrica: config.includeWestAfrica,
        includeNorthAfrica: config.includeNorthAfrica,
        includeCentralAfrica: config.includeCentralAfrica,
        includeEdgeCases: config.includeEdgeCases,
        languageVariants: ['en', 'sw', 'fr', 'ar'] // English, Swahili, French, Arabic
      });
      allData.push(...syntheticData);
    }

    // Export in requested format
    switch (config.exportFormat) {
      case 'jsonl':
        return this.exportToJSONL(allData);
      case 'csv':
        return this.exportToCSV(allData);
      case 'json':
        return JSON.stringify(allData, null, 2);
      default:
        throw new Error(`Unsupported export format: ${config.exportFormat}`);
    }
  }

  private exportToJSONL(data: CanonicalShipment[]): string {
    return syntheticDataGenerator.exportToJSONL(data);
  }

  private exportToCSV(data: CanonicalShipment[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(shipment => 
      Object.values(shipment).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  }

  // Download helper
  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Generate training prompts for different scenarios
  generateTrainingPrompts(data: CanonicalShipment[]): Array<{prompt: string, response: string}> {
    const prompts: Array<{prompt: string, response: string}> = [];

    data.forEach(shipment => {
      // Route optimization prompt
      prompts.push({
        prompt: `What's the best route for shipping ${shipment.cargo_type} from ${shipment.origin} to ${shipment.destination}?`,
        response: `For ${shipment.cargo_type} from ${shipment.origin} to ${shipment.destination}, I recommend ${shipment.mode_of_shipment} transport via ${shipment.routing}. Expected transit time: ${shipment.transit_days} days. Optimal carrier: ${shipment.carrier}. This route has a ${shipment.overall_performance_score.toFixed(1)}% performance score based on historical data.`
      });

      // Cost estimation prompt
      prompts.push({
        prompt: `Estimate shipping costs for ${shipment.weight_kg}kg of ${shipment.cargo_type} from ${shipment.origin} to ${shipment.destination}`,
        response: `Based on ${shipment.weight_kg}kg of ${shipment.cargo_type} from ${shipment.origin} to ${shipment.destination}, estimated costs: Base cost: $${shipment.actual_cost.toFixed(2)}, Fuel surcharge: $${shipment.fuel_surcharge.toFixed(2)}, Insurance: $${shipment.insurance.toFixed(2)}, Total: $${shipment.total_cost.toFixed(2)}. Mode: ${shipment.mode_of_shipment}.`
      });

      // Risk assessment prompt
      if (shipment.delay_days > 0 || shipment.damage || shipment.loss) {
        prompts.push({
          prompt: `What are the risks for shipping ${shipment.cargo_type} from ${shipment.origin} to ${shipment.destination}?`,
          response: `Risk assessment for ${shipment.cargo_type} route ${shipment.origin} to ${shipment.destination}: Risk score: ${shipment.risk_assessment_score.toFixed(1)}%. Historical issues: ${shipment.delay_days > 0 ? `${shipment.delay_days} day delays` : 'No delays'}, ${shipment.damage ? 'Damage incidents' : 'No damage'}, ${shipment.loss ? 'Loss incidents' : 'No loss'}. Recommended precautions: Insurance, tracking, ${shipment.temperature_control_failures ? 'temperature monitoring' : 'standard monitoring'}.`
        });
      }
    });

    return prompts;
  }
}

export const dataExportService = new DataExportService();
