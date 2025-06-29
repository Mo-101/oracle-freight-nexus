
import React from 'react';
import { RouteOption, CorridorIntelligence } from '@/types/freight';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Plane, Ship, Truck, Train, TrendingUp, AlertTriangle } from 'lucide-react';

interface RouteIntelligencePanelProps {
  corridorData: CorridorIntelligence;
  routeOptions: RouteOption[];
}

export const RouteIntelligencePanel = ({ corridorData, routeOptions }: RouteIntelligencePanelProps) => {
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Air': return <Plane className="w-5 h-5" />;
      case 'Sea': return <Ship className="w-5 h-5" />;
      case 'Land': return <Truck className="w-5 h-5" />;
      case 'Rail': return <Train className="w-5 h-5" />;
      default: return <Truck className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 3) return 'bg-green-900/30 text-green-300';
    if (risk <= 6) return 'bg-yellow-900/30 text-yellow-300';
    return 'bg-red-900/30 text-red-300';
  };

  return (
    <div className="space-y-6">
      {/* Corridor Intelligence Summary */}
      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="text-deepcal-light flex items-center">
            🛣️ Corridor Intelligence: {corridorData.origin} → {corridorData.destination}
            <TrendingUp className="w-5 h-5 ml-2" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-deepcal-light">
                {corridorData.totalShipments}
              </div>
              <div className="text-sm text-slate-400">Historical Shipments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {corridorData.successRate}%
              </div>
              <div className="text-sm text-slate-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {corridorData.avgTransitDays}
              </div>
              <div className="text-sm text-slate-400">Avg Transit Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {corridorData.predominantMode}
              </div>
              <div className="text-sm text-slate-400">Primary Mode</div>
            </div>
          </div>
          
          {corridorData.riskFactors.length > 0 && (
            <div className="mt-4 p-3 bg-amber-900/20 rounded border-l-4 border-amber-400">
              <div className="flex items-center text-amber-400 mb-2">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span className="font-semibold">Corridor Risk Factors</span>
              </div>
              <div className="text-sm text-slate-300">
                {corridorData.riskFactors.join(' • ')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route Options Analysis */}
      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="text-deepcal-light">
            🚀 Multi-Modal Route Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routeOptions.map((route, index) => (
              <div 
                key={index}
                className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-deepcal-purple/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getModeIcon(route.mode)}
                    <div>
                      <h3 className="font-semibold text-white">{route.mode} Transport</h3>
                      <p className="text-sm text-slate-400">{route.corridor}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${getConfidenceColor(route.confidence)}`}>
                    {Math.round(route.confidence * 100)}% Confidence
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Distance:</span>
                    <div className="font-semibold text-white">{route.distanceKm.toLocaleString()} km</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Transit:</span>
                    <div className="font-semibold text-white">{route.transitTimeDays} days</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Risk Level:</span>
                    <div className={`px-2 py-1 rounded text-xs ${getRiskColor(route.riskFactor)}`}>
                      {route.riskFactor}/10
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Emissions:</span>
                    <div className="font-semibold text-white">{route.emissionScore} gCO₂/km</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Avg Cost:</span>
                    <div className="font-semibold text-green-400">${route.avgCost}/kg</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Based on {route.historicalShipments} historical shipments • {route.successRate}% success rate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
