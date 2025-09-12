import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface EnhancedPredictiveTimelineProps {
  selectedForwarder?: string;
  reliabilityScore?: number;
}

export const EnhancedPredictiveTimeline = ({ 
  selectedForwarder = 'Kuehne Nagel', 
  reliabilityScore = 85 
}: EnhancedPredictiveTimelineProps) => {
  const timelineData = [
    { 
      date: '2024-01-15', 
      event: 'Shipment Pickup', 
      status: 'completed', 
      confidence: 100,
      icon: CheckCircle,
      color: 'text-green-500'
    },
    { 
      date: '2024-01-18', 
      event: 'Border Processing', 
      status: 'in-progress', 
      confidence: reliabilityScore,
      icon: Clock,
      color: 'text-blue-500'
    },
    { 
      date: '2024-01-22', 
      event: 'Transit Hub Arrival', 
      status: 'predicted', 
      confidence: Math.max(75, reliabilityScore - 10),
      icon: TrendingUp,
      color: 'text-amber-500'
    },
    { 
      date: '2024-01-25', 
      event: 'Final Delivery', 
      status: 'predicted', 
      confidence: Math.max(70, reliabilityScore - 15),
      icon: AlertTriangle,
      color: 'text-purple-500'
    }
  ];

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Clock className="w-5 h-5" />
          Enhanced Predictive Timeline - {selectedForwarder}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                <IconComponent className={`w-5 h-5 ${item.color}`} />
                <div className="flex-1">
                  <div className="font-medium text-foreground">{item.event}</div>
                  <div className="text-sm text-muted-foreground">{item.date}</div>
                  <div className="text-xs text-muted-foreground capitalize">{item.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {item.confidence}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    confidence
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
          <div className="text-sm text-foreground">
            <strong>AI Prediction:</strong> Based on {selectedForwarder}'s historical performance 
            (reliability: {reliabilityScore}%), delivery expected within predicted timeframe.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};