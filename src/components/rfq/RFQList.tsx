
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { rfqService } from '@/services/rfqService';
import { RFQ } from '@/types/rfq';

export const RFQList = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRFQ, setSelectedRFQ] = useState<string | null>(null);

  useEffect(() => {
    loadRFQs();
  }, []);

  const loadRFQs = async () => {
    try {
      const data = await rfqService.getAllRFQs();
      setRfqs(data);
    } catch (error) {
      console.error('Error loading RFQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'quoted': return 'bg-yellow-500';
      case 'awarded': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card className="oracle-card">
        <CardContent className="p-6">
          <div className="text-center text-slate-400">Loading RFQs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light">My RFQs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rfqs.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              No RFQs found. Create your first RFQ to get started.
            </div>
          ) : (
            rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedRFQ === rfq.id
                    ? 'border-deepcal-purple bg-deepcal-purple/10'
                    : 'border-slate-600 bg-slate-800/30 hover:border-deepcal-purple/50'
                }`}
                onClick={() => setSelectedRFQ(selectedRFQ === rfq.id ? null : rfq.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-200">{rfq.id}</h3>
                    <p className="text-sm text-slate-400">
                      {rfq.origin} → {rfq.destination}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(rfq.status)} text-white`}>
                    {rfq.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Goods:</span>
                    <span className="ml-2 text-slate-200">{rfq.goods_type}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Weight:</span>
                    <span className="ml-2 text-slate-200">{rfq.weight_kg} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Volume:</span>
                    <span className="ml-2 text-slate-200">{rfq.volume_cbm} CBM</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Delivery:</span>
                    <span className="ml-2 text-slate-200">
                      {new Date(rfq.required_delivery_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {selectedRFQ === rfq.id && (
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-deepcal-purple/20 border-deepcal-purple/50 text-deepcal-light"
                      >
                        View Quotes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-slate-700/50 border-slate-600 text-slate-300"
                      >
                        Edit RFQ
                      </Button>
                    </div>
                    {rfq.special_instructions && (
                      <div className="mt-3">
                        <p className="text-xs text-slate-400">Special Instructions:</p>
                        <p className="text-sm text-slate-300">{rfq.special_instructions}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
