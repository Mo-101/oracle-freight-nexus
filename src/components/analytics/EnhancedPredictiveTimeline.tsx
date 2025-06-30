
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Package, FileCheck, Plane, MapPin, CheckCircle, Calendar } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'in_progress' | 'pending';
  description: string;
  insight: string;
  confidence: number;
  icon: React.ReactNode;
}

interface EnhancedPredictiveTimelineProps {
  selectedForwarder?: string;
  reliabilityScore?: number;
}

export const EnhancedPredictiveTimeline = ({ 
  selectedForwarder = 'Kuehne Nagel', 
  reliabilityScore = 85 
}: EnhancedPredictiveTimelineProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Cargo Collection',
      date: '2025-07-01',
      status: 'in_progress',
      description: 'Shipment collection from origin warehouse',
      insight: `${selectedForwarder} collection efficiency: Good`,
      confidence: 86,
      icon: <Package className="w-5 h-5" />
    },
    {
      id: '2',
      title: 'Export Clearance',
      date: '2025-07-02',
      status: 'pending',
      description: 'Export documentation and customs processing',
      insight: `${selectedForwarder} customs expertise applied`,
      confidence: 86,
      icon: <FileCheck className="w-5 h-5" />
    },
    {
      id: '3',
      title: 'Transit Departure',
      date: '2025-07-03',
      status: 'pending',
      description: 'Scheduled departure via optimal route',
      insight: `Using ${selectedForwarder}'s preferred carrier network`,
      confidence: 81,
      icon: <Plane className="w-5 h-5" />
    },
    {
      id: '4',
      title: 'Destination Arrival',
      date: '2025-07-06',
      status: 'pending',
      description: 'Arrival at destination hub',
      insight: `${selectedForwarder} destination handling protocols`,
      confidence: 84,
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: '5',
      title: 'Import Clearance',
      date: '2025-07-07',
      status: 'pending',
      description: 'Import documentation and customs clearance',
      insight: `${selectedForwarder} local partner coordination`,
      confidence: 81,
      icon: <FileCheck className="w-5 h-5" />
    },
    {
      id: '6',
      title: 'Final Delivery',
      date: '2025-07-08',
      status: 'pending',
      description: 'Last mile delivery to consignee',
      insight: `${selectedForwarder} delivery network optimization`,
      confidence: 83,
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  const handleUpdate = async () => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsUpdating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'in_progress': return 'text-deepcal-light bg-deepcal-light/20 border-deepcal-light/30';
      case 'pending': return 'text-slate-400 bg-slate-400/20 border-slate-400/30';
      default: return 'text-slate-400 bg-slate-400/20 border-slate-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '⟳';
      case 'pending': return '○';
      default: return '○';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-400';
    if (confidence >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-deepcal-light flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            AI-Enhanced Predictive Timeline
          </CardTitle>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
            Update
          </Button>
        </div>
        <div className="text-sm text-slate-400 space-y-1">
          <p>Dynamic predictions based on {selectedForwarder} performance and corridor intelligence</p>
          <div className="flex items-center space-x-4">
            <span>📊 Forwarder-Specific Insights</span>
            <span>Timeline optimized for {selectedForwarder} with {reliabilityScore}% reliability score.</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline connector line */}
              {index < timelineEvents.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-12 bg-slate-600"></div>
              )}
              
              <div className="flex items-start space-x-4">
                {/* Status indicator */}
                <div className={`flex items-center justify-center w-16 h-16 rounded-full border-2 ${getStatusColor(event.status)}`}>
                  <span className="text-2xl">{getStatusIcon(event.status)}</span>
                </div>
                
                {/* Event content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-white text-lg">{event.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-slate-300 font-mono">
                      {event.date}
                    </div>
                  </div>
                  
                  <p className="text-slate-300 mb-3">{event.description}</p>
                  
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">💡</span>
                        <span className="text-sm text-slate-300">{event.insight}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400">AI Confidence:</span>
                        <span className={`text-sm font-bold ${getConfidenceColor(event.confidence)}`}>
                          {event.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-deepcal-purple/20 to-deepcal-light/20 rounded-lg border border-deepcal-light/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">
              🤖 AI-powered timeline optimization for {selectedForwarder}
            </span>
            <span className="text-deepcal-light font-medium">
              Overall Success Probability: {reliabilityScore}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
