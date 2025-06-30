
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
      {/* Real-Time Dynamic Ranking - New Feature */}
      <RealTimeRankingPanel 
        forwarders={forwarderIntelligence}
        onRankingUpdate={handleRankingUpdate}
      />

      {/* Symbolic Decision - Show After Ranking */}
      <SymbolicDecisionEngine 
        decision={symbolicDecision}
      />

      {/* Route Intelligence */}
      <RouteIntelligencePanel 
        corridorData={corridorIntelligence}
        routeOptions={routeOptions}
      />

      {/* Forwarder Matrix - Now uses ranked data if available */}
      <ForwarderIntelligenceMatrix 
        forwarders={rankedForwarders.length > 0 ? rankedForwarders : forwarderIntelligence}
        cargoType={cargoType}
      />

      {/* Cargo & Weight Context */}
      <div className="oracle-card p-6">
        <h3 className="font-semibold text-deepcal-light mb-4">📦 Shipment Context</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Cargo Type:</span>
            <div className="font-semibold text-white">{cargoType}</div>
          </div>
          <div>
            <span className="text-slate-400">Weight:</span>
            <div className="font-semibold text-white">{weight.toLocaleString()} kg</div>
          </div>
          <div>
            <span className="text-slate-400">Volume:</span>
            <div className="font-semibold text-white">{volume} CBM</div>
          </div>
          <div>
            <span className="text-slate-400">Density:</span>
            <div className="font-semibold text-white">{Math.round(weight / volume)} kg/CBM</div>
          </div>
        </div>
      </div>
    </div>
  );
};
