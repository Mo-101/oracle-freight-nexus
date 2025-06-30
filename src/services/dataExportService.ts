import { CanonicalShipment } from '@/types/freight';
import { canonicalShipmentData } from '@/data/canonicalData';
import { canonicalDataGenerator } from './syntheticDataGenerator';

interface ExportConfig {
  includeCanonical: boolean;
  syntheticCount: number;
  includeWestAfrica: boolean;
  includeNorthAfrica: boolean;
  includeCentralAfrica: boolean;
  includeEdgeCases: boolean;
  exportFormat: 'jsonl' | 'csv' | 'json';
  modelName: string;
  epochs: number;
  learningRate: number;
  batchSize: number;
}

class DataExportService {
  async exportForFineTuning(config: ExportConfig): Promise<string> {
    let allData: CanonicalShipment[] = [];

    // Add canonical data if requested
    if (config.includeCanonical) {
      allData.push(...canonicalShipmentData);
    }

    // Generate synthetic data
    if (config.syntheticCount > 0) {
      const syntheticConfig = {
        count: config.syntheticCount,
        includeWestAfrica: config.includeWestAfrica,
        includeNorthAfrica: config.includeNorthAfrica,
        includeCentralAfrica: config.includeCentralAfrica,
        includeEdgeCases: config.includeEdgeCases,
        languageVariants: ['en', 'fr', 'sw'] // English, French, Swahili
      };

      const syntheticData = canonicalDataGenerator.generateSyntheticData(syntheticConfig);
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
        return this.exportToJSONL(allData);
    }
  }

  private exportToJSONL(data: CanonicalShipment[]): string {
    return data.map(shipment => {
      // Create training prompt-response pairs
      const prompt = this.generateTrainingPrompt(shipment);
      const response = this.generateTrainingResponse(shipment);
      
      return JSON.stringify({
        messages: [
          { role: "system", content: "You are DeepCAL, an AI assistant specialized in African logistics and freight forwarding. Provide accurate, data-driven insights based on historical shipment data." },
          { role: "user", content: prompt },
          { role: "assistant", content: response }
        ]
      });
    }).join('\n');
  }

  private exportToCSV(data: CanonicalShipment[]): string {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(shipment => 
      Object.values(shipment).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  private generateTrainingPrompt(shipment: CanonicalShipment): string {
    return `Analyze this African logistics shipment: ${shipment.cargo_type} from ${shipment.origin} to ${shipment.destination}, ${shipment.weight_kg}kg via ${shipment.mode_of_shipment}. What are the optimal carrier recommendations and risk factors?`;
  }

  private generateTrainingResponse(shipment: CanonicalShipment): string {
    const transitDays = typeof shipment.transit_days === 'string' ? 
      parseFloat(shipment.transit_days) : shipment.transit_days;
    const actualCost = typeof shipment.actual_cost === 'string' ? 
      parseFloat(shipment.actual_cost.toString()) : shipment.actual_cost;
    
    const riskFactors = [];
    if (shipment.delay_days && parseFloat(shipment.delay_days.toString()) > 0) {
      riskFactors.push('potential transit delays');
    }
    if (shipment.damage) riskFactors.push('cargo damage risk');
    if (shipment.documentation_errors) riskFactors.push('documentation complexities');
    if (shipment.customs_brokerage && parseFloat(shipment.customs_brokerage.toString()) > 500) {
      riskFactors.push('customs clearance delays');
    }

    return `Based on historical African logistics data, this ${shipment.cargo_type} shipment from ${shipment.origin} to ${shipment.destination} via ${shipment.mode_of_shipment} has the following characteristics:

**Transit Time:** ${transitDays} days (typical for this corridor)
**Optimal Carrier:** ${shipment.carrier} 
**Cost Estimate:** $${actualCost.toFixed(2)} total
**Success Rate:** ${shipment.shipment_status === 'Delivered' ? '✅ High' : '⚠️ Variable'}

**Risk Assessment:**
${riskFactors.length > 0 ? riskFactors.map(risk => `• ${risk}`).join('\n') : '• Standard risk profile for this route'}

**Route Intelligence:** The ${shipment.origin}-${shipment.destination} corridor shows ${shipment.mode_of_shipment.toLowerCase()} as a viable option with ${shipment.routing} routing. Consider seasonal variations and regulatory requirements for optimal execution.`;
  }

  downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const dataExportService = new DataExportService();
