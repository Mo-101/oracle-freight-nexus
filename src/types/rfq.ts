
export interface RFQ {
  id: string;
  origin: string;
  destination: string;
  goods_type: string;
  weight_kg: number;
  volume_cbm: number;
  required_delivery_date: string;
  special_instructions?: string;
  status: 'open' | 'quoted' | 'awarded' | 'cancelled';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  rfq_id: string;
  forwarder_name: string;
  rate: number;
  currency: string;
  transit_days: number;
  validity_date: string;
  remarks?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Shipment {
  id: string;
  quote_id: string;
  rfq_id: string;
  shipment_reference: string;
  status: 'preparing' | 'in_transit' | 'delivered' | 'delayed';
  pickup_date?: string;
  delivery_date?: string;
  tracking_updates: TrackingUpdate[];
  created_at: string;
  updated_at: string;
}

export interface TrackingUpdate {
  id: string;
  shipment_id: string;
  location: string;
  status: string;
  timestamp: string;
  notes?: string;
}

export interface EmailNotification {
  id: string;
  type: 'rfq_created' | 'quote_received' | 'quote_accepted' | 'shipment_created' | 'shipment_update';
  recipient_email: string;
  subject: string;
  content: string;
  sent_at: string;
  status: 'pending' | 'sent' | 'failed';
}
