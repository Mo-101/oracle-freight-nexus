
import { supabase } from '@/lib/supabase';
import { ShipmentData, ForwarderAnalysis, DeepCALDecision } from '@/utils/deepcalCore';

export interface SupabaseShipment {
  id: string;
  shipment_id: string;
  origin_country: string;
  destination_country: string;
  weight_kg: number;
  volume_cbm: number;
  cost: number;
  forwarder: string;
  transit_days: number;
  delay_days?: number;
  actual_transit_days?: number;
  actual_cost?: number;
  on_time?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseForwarderPerformance {
  id: string;
  forwarder: string;
  avg_cost_per_kg: number;
  avg_transit_days: number;
  reliability_score: number;
  risk_level: number;
  shipment_count: number;
  on_time_rate: number;
  last_updated: string;
}

export interface SupabaseDeepCALAnalysis {
  id: string;
  analysis_type: string;
  ranking: any;
  criteria_weights: any;
  consistency_ratio: number;
  is_consistent: boolean;
  analysis_report?: string;
  data_version: string;
  forwarders_analyzed: string[];
  created_at: string;
}

class SupabaseDataService {
  private static instance: SupabaseDataService;

  private constructor() {}

  static getInstance(): SupabaseDataService {
    if (!SupabaseDataService.instance) {
      SupabaseDataService.instance = new SupabaseDataService();
    }
    return SupabaseDataService.instance;
  }

  // Bulk insert shipments from CSV data
  async bulkInsertShipments(shipments: ShipmentData[], replaceExisting = false): Promise<boolean> {
    try {
      console.log('📦 Supabase: Starting bulk shipment insert...', shipments.length, 'records');

      if (replaceExisting) {
        // Clear existing data if replacing
        const { error: deleteError } = await supabase
          .from('shipments')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (deleteError) {
          console.error('❌ Failed to clear existing shipments:', deleteError);
          return false;
        }
      }

      // Convert and insert shipments in batches
      const batchSize = 100;
      for (let i = 0; i < shipments.length; i += batchSize) {
        const batch = shipments.slice(i, i + batchSize).map(shipment => ({
          shipment_id: shipment.shipment_id,
          origin_country: shipment.origin_country,
          destination_country: shipment.destination_country,
          weight_kg: parseFloat(shipment.weight_kg as string) || 0,
          volume_cbm: parseFloat(shipment.volume_cbm as string) || 0,
          cost: parseFloat(shipment.cost as string) || 0,
          forwarder: shipment.forwarder,
          transit_days: parseInt(shipment.transit_days as string) || 0,
          delay_days: shipment.delay_days ? parseInt(shipment.delay_days as string) : 0,
          on_time: shipment.delay_days ? parseInt(shipment.delay_days as string) <= 0 : null
        }));

        const { error: insertError } = await supabase
          .from('shipments')
          .insert(batch);

        if (insertError) {
          console.error('❌ Batch insert failed:', insertError);
          return false;
        }

        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(shipments.length / batchSize)}`);
      }

      console.log('✅ Supabase: Bulk insert completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Supabase bulk insert error:', error);
      return false;
    }
  }

  // Get all shipments
  async getAllShipments(): Promise<ShipmentData[]> {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch shipments:', error);
        return [];
      }

      return data.map(ship => ({
        shipment_id: ship.shipment_id,
        origin_country: ship.origin_country,
        destination_country: ship.destination_country,
        weight_kg: ship.weight_kg.toString(),
        volume_cbm: ship.volume_cbm.toString(),
        cost: ship.cost.toString(),
        forwarder: ship.forwarder,
        transit_days: ship.transit_days.toString(),
        delay_days: ship.delay_days?.toString(),
        actual_transit_days: ship.actual_transit_days?.toString(),
        actual_cost: ship.actual_cost?.toString(),
        on_time: ship.on_time
      }));
    } catch (error) {
      console.error('❌ Error fetching shipments:', error);
      return [];
    }
  }

  // Get forwarder performance data
  async getForwarderPerformance(): Promise<ForwarderAnalysis[]> {
    try {
      const { data, error } = await supabase
        .from('forwarder_performance')
        .select('*')
        .order('shipment_count', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch forwarder performance:', error);
        return [];
      }

      return data.map(perf => ({
        forwarder: perf.forwarder,
        avgCostPerKg: perf.avg_cost_per_kg,
        avgTransitDays: perf.avg_transit_days,
        reliabilityScore: perf.reliability_score,
        riskLevel: perf.risk_level,
        shipmentCount: perf.shipment_count,
        onTimeRate: perf.on_time_rate
      }));
    } catch (error) {
      console.error('❌ Error fetching forwarder performance:', error);
      return [];
    }
  }

  // Save DeepCAL analysis result
  async saveAnalysis(decision: DeepCALDecision): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('deepcal_analyses')
        .insert({
          ranking: decision.ranking,
          criteria_weights: decision.criteriaWeights,
          consistency_ratio: decision.consistencyRatio,
          is_consistent: decision.isConsistent,
          analysis_report: decision.analysis,
          data_version: decision.dataVersion,
          forwarders_analyzed: decision.ranking.map(r => r.alternative.name)
        })
        .select('id')
        .single();

      if (error) {
        console.error('❌ Failed to save analysis:', error);
        return null;
      }

      console.log('✅ Analysis saved with ID:', data.id);
      return data.id;
    } catch (error) {
      console.error('❌ Error saving analysis:', error);
      return null;
    }
  }

  // Get analysis history
  async getAnalysisHistory(limit = 10): Promise<SupabaseDeepCALAnalysis[]> {
    try {
      const { data, error } = await supabase
        .from('deepcal_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Failed to fetch analysis history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error fetching analysis history:', error);
      return [];
    }
  }

  // Update shipment with actual performance data
  async updateShipmentPerformance(
    shipmentId: string,
    actualTransitDays: number,
    actualCost: number,
    onTime: boolean
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shipments')
        .update({
          actual_transit_days: actualTransitDays,
          actual_cost: actualCost,
          on_time: onTime,
          updated_at: new Date().toISOString()
        })
        .eq('shipment_id', shipmentId);

      if (error) {
        console.error('❌ Failed to update shipment performance:', error);
        return false;
      }

      console.log('✅ Updated shipment performance:', shipmentId);
      return true;
    } catch (error) {
      console.error('❌ Error updating shipment performance:', error);
      return false;
    }
  }

  // Search similar shipments using the existing deepcal_match function
  async findSimilarShipments(query: string, limit = 5): Promise<ShipmentData[]> {
    try {
      // First get all shipments to build corpus
      const allShipments = await this.getAllShipments();
      const corpus = allShipments.map(ship => 
        `${ship.origin_country} to ${ship.destination_country} via ${ship.forwarder} - ${ship.weight_kg}kg, ${ship.transit_days} days`
      );

      const { data, error } = await supabase.functions.invoke('deepcal_match', {
        body: { query, corpus }
      });

      if (error) {
        console.error('❌ Similarity search failed:', error);
        return [];
      }

      // Return top matches with their corresponding shipment data
      const topMatches = data.matches.slice(0, limit);
      return topMatches.map((match: any) => {
        const index = corpus.indexOf(match.text);
        return index >= 0 ? allShipments[index] : null;
      }).filter(Boolean);
    } catch (error) {
      console.error('❌ Error in similarity search:', error);
      return [];
    }
  }
}

export const supabaseDataService = SupabaseDataService.getInstance();
