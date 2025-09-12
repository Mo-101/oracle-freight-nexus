import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export const PredictiveTimeline = () => {
  const timelineData = [
    { date: '2024-01-15', event: 'Shipment Departure', status: 'completed', confidence: 100 },
    { date: '2024-01-18', event: 'Border Clearance', status: 'predicted', confidence: 92 },
    { date: '2024-01-22', event: 'Transit Hub', status: 'predicted', confidence: 88 },
    { date: '2024-01-25', event: 'Final Delivery', status: 'predicted', confidence: 85 }
  ];

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Clock className="w-5 h-5" />
          Predictive Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineData.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className={`w-3 h-3 rounded-full ${
                item.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <div className="font-medium">{item.event}</div>
                <div className="text-sm text-muted-foreground">{item.date}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.confidence}% confidence
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};