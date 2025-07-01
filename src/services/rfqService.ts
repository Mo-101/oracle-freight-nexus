
import { neonConfig } from '@/lib/supabase';
import { RFQ, Quote, Shipment, TrackingUpdate } from '@/types/rfq';

export class RFQService {
  private static instance: RFQService;

  private constructor() {}

  static getInstance(): RFQService {
    if (!RFQService.instance) {
      RFQService.instance = new RFQService();
    }
    return RFQService.instance;
  }

  async createRFQ(rfqData: Omit<RFQ, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<string> {
    try {
      console.log('🔄 Creating new RFQ:', rfqData);
      
      // Simulate database operation
      await this.simulateDbOperation(300);
      
      const rfqId = `rfq_${Date.now()}`;
      console.log('✅ RFQ created with ID:', rfqId);
      
      // Trigger email notifications to forwarders
      await this.notifyForwardersOfNewRFQ(rfqId, rfqData);
      
      return rfqId;
    } catch (error) {
      console.error('❌ Error creating RFQ:', error);
      throw error;
    }
  }

  async getAllRFQs(userId?: string): Promise<RFQ[]> {
    try {
      console.log('📋 Fetching RFQs for user:', userId);
      
      await this.simulateDbOperation(200);
      
      // Mock data for demonstration
      const mockRFQs: RFQ[] = [
        {
          id: 'rfq_001',
          origin: 'Nairobi, Kenya',
          destination: 'Lusaka, Zambia',
          goods_type: 'Medical Supplies',
          weight_kg: 500,
          volume_cbm: 2.5,
          required_delivery_date: '2025-01-15',
          special_instructions: 'Temperature controlled transport required',
          status: 'quoted',
          user_id: 'user_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'rfq_002',
          origin: 'Dar es Salaam, Tanzania',
          destination: 'Harare, Zimbabwe',
          goods_type: 'Electronics',
          weight_kg: 300,
          volume_cbm: 1.8,
          required_delivery_date: '2025-01-20',
          status: 'open',
          user_id: 'user_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockRFQs;
    } catch (error) {
      console.error('❌ Error fetching RFQs:', error);
      return [];
    }
  }

  async getQuotesForRFQ(rfqId: string): Promise<Quote[]> {
    try {
      console.log('💰 Fetching quotes for RFQ:', rfqId);
      
      await this.simulateDbOperation(150);
      
      const mockQuotes: Quote[] = [
        {
          id: 'quote_001',
          rfq_id: rfqId,
          forwarder_name: 'DHL Express',
          rate: 1200,
          currency: 'USD',
          transit_days: 5,
          validity_date: '2025-01-10',
          remarks: 'Express service with tracking',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'quote_002',
          rfq_id: rfqId,
          forwarder_name: 'FedEx International',
          rate: 1350,
          currency: 'USD',
          transit_days: 4,
          validity_date: '2025-01-12',
          remarks: 'Priority overnight delivery available',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockQuotes;
    } catch (error) {
      console.error('❌ Error fetching quotes:', error);
      return [];
    }
  }

  async acceptQuote(quoteId: string): Promise<boolean> {
    try {
      console.log('✅ Accepting quote:', quoteId);
      
      await this.simulateDbOperation(250);
      
      // Create shipment from accepted quote
      const shipmentId = await this.createShipmentFromQuote(quoteId);
      console.log('📦 Shipment created:', shipmentId);
      
      return true;
    } catch (error) {
      console.error('❌ Error accepting quote:', error);
      return false;
    }
  }

  private async createShipmentFromQuote(quoteId: string): Promise<string> {
    const shipmentId = `ship_${Date.now()}`;
    console.log('🚢 Creating shipment from quote:', quoteId, '→', shipmentId);
    
    // Notify both parties about shipment creation
    await this.notifyShipmentCreated(shipmentId, quoteId);
    
    return shipmentId;
  }

  private async notifyForwardersOfNewRFQ(rfqId: string, rfqData: any): Promise<void> {
    console.log('📧 Notifying forwarders of new RFQ:', rfqId);
    // Email notification logic would go here
  }

  private async notifyShipmentCreated(shipmentId: string, quoteId: string): Promise<void> {
    console.log('📧 Notifying parties of shipment creation:', shipmentId);
    // Email notification logic would go here
  }

  private async simulateDbOperation(delay: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const rfqService = RFQService.getInstance();
