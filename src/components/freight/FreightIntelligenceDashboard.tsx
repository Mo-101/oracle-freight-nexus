
import React, { useMemo, useState } from 'react';
import { RouteIntelligencePanel } from './RouteIntelligencePanel';
import { ForwarderIntelligenceMatrix } from './ForwarderIntelligenceMatrix';
import { SymbolicDecisionEngine } from './SymbolicDecisionEngine';
import { RealTimeRankingPanel } from './RealTimeRankingPanel';
import { freightIntelligenceEngine } from '@/utils/freightIntelligenceEngine';
import { ForwarderIntelligence } from '@/types/freight';

interface FreightIntelligenceDashboardProps {
  origin: string;
  destination: string;
  cargoType: string;
  weight: number;
  volume: number;
}

export const FreightIntelligenceDashboard = ({
  origin,
  destination,
  cargoType,
  weight,
  volume
}: FreightIntelligenceDashboardProps) => {
  
  const [rankedForwarders, setRankedForwarders] = useState<ForwarderIntelligence[]>([]);
  
  const corridorIntelligence = useMemo(() => 
    freightIntelligenceEngine.analyzeCorridorIntelligence(origin, destination),
    [origin, destination]
  );

  const routeOptions = useMemo(() => 
    freightIntelligenceEngine.generateRouteOptions(origin, destination),
    [origin, destination]
  );

  const forwarderIntelligence = useMemo(() => 
    freightIntelligenceEngine.generateForwarderIntelligence(cargoType),
    [cargoType]
  );

  const symbolicDecision = useMemo(() => 
    freightIntelligenceEngine.generateSymbolicDecision(
      corridorIntelligence,
      routeOptions,
      rankedForwarders.length > 0 ? rankedForwarders : forwarderIntelligence,
      cargoType
    ),
    [corridorIntelligence, routeOptions, rankedForwarders, forwarderIntelligence, cargoType]
  );

  const handleRankingUpdate = (updatedForwarders: ForwarderIntelligence[]) => {
    setRankedForwarders(updatedForwarders);
  };

  return (
    <div className="space-y-8">
      {/* 1. Oracle Recommendations - First Display */}
      <SymbolicDecisionEngine 
        decision={symbolicDecision}
      />

      {/* 2. Real-Time Dynamic Ranking - Price/Performance */}
      <RealTimeRankingPanel 
        forwarders={forwarderIntelligence}
        onRankingUpdate={handleRankingUpdate}
      />

      {/* 3. Combined Corridor Intelligence & Shipment Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Corridor Intelligence */}
        <div className="oracle-card p-6">
          <h3 className="font-semibold text-deepcal-light mb-4 flex items-center">
            🛣️ Corridor Intelligence: {corridorIntelligence.origin} → {corridorIntelligence.destination}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-deepcal-light">
                {corridorIntelligence.totalShipments}
              </div>
              <div className="text-sm text-slate-400">Historical Shipments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {corridorIntelligence.successRate}%
              </div>
              <div className="text-sm text-slate-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {corridorIntelligence.avgTransitDays}
              </div>
              <div className="text-sm text-slate-400">Avg Transit Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {corridorIntelligence.predominantMode}
              </div>
              <div className="text-sm text-slate-400">Primary Mode</div>
            </div>
          </div>
          
          {corridorIntelligence.riskFactors.length > 0 && (
            <div className="p-3 bg-amber-900/20 rounded border-l-4 border-amber-400">
              <div className="flex items-center text-amber-400 mb-2">
                <span className="font-semibold">Corridor Risk Factors</span>
              </div>
              <div className="text-sm text-slate-300">
                {corridorIntelligence.riskFactors.join(' • ')}
              </div>
            </div>
          )}
        </div>

        {/* Shipment Context */}
        <div className="oracle-card p-6">
          <h3 className="font-semibold text-deepcal-light mb-4">📦 Shipment Context</h3>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400">Cargo Type:</span>
                <div className="font-semibold text-white">{cargoType}</div>
              </div>
              <div>
                <span className="text-slate-400">Weight:</span>
                <div className="font-semibold text-white">{weight.toLocaleString()} kg</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400">Volume:</span>
                <div className="font-semibold text-white">{volume} CBM</div>
              </div>
              <div>
                <span className="text-slate-400">Density:</span>
                <div className="font-semibold text-white">{Math.round(weight / volume)} kg/CBM</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-900/20 rounded border-l-4 border-blue-400">
              <div className="text-blue-400 font-semibold mb-2">Route Analysis</div>
              <div className="text-sm text-slate-300">
                {origin} → {destination} corridor shows optimal performance with {corridorIntelligence.predominantMode.toLowerCase()} transport mode
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Route Intelligence - Distance/Route Options */}
      <RouteIntelligencePanel 
        corridorData={corridorIntelligence}
        routeOptions={routeOptions}
      />

      {/* 5. Forwarder Matrix - Detailed Analysis */}
      <ForwarderIntelligenceMatrix 
        forwarders={rankedForwarders.length > 0 ? rankedForwarders : forwarderIntelligence}
        cargoType={cargoType}
      />
    </div>
  );
};
