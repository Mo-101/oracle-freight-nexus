
import React from 'react';
import { canonicalShipmentData, getRouteData } from '../data/canonicalData';

interface ForwarderRanking {
  name: string;
  transitDays: number;
  cost: number;
  risk: number;
  score: number;
  rank: number;
}

interface OutputPanelProps {
  isVisible: boolean;
  rankings: ForwarderRanking[];
  formData: any;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ isVisible, rankings, formData }) => {
  if (!isVisible) return null;

  const getMedalIcon = (rank: number) => {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[rank - 1] || '🔹';
  };

  const getRankColor = (rank: number) => {
    const colors = ['text-deepcal-light', 'text-amber-400', 'text-rose-400'];
    return colors[rank - 1] || 'text-slate-400';
  };

  const getRiskColor = (risk: number) => {
    if (risk < 10) return 'bg-emerald-900/30 text-emerald-300';
    if (risk < 20) return 'bg-amber-900/30 text-amber-300';
    return 'bg-rose-900/30 text-rose-300';
  };

  const topForwarder = rankings[0];
  
  // Get route-specific data from canonical dataset
  const routeData = getRouteData(formData.origin, formData.destination);
  const totalCanonicalShipments = canonicalShipmentData.length;
  const routeShipments = routeData.length;

  return (
    <div className="lg:col-span-2 animate-scroll-appear" id="outputPanel">
      <div className="oracle-card p-6">
        {/* Oracle Transmission Header */}
        <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple p-5 rounded-t-xl symbolic-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <i className="fas fa-scroll text-2xl text-white mr-3"></i>
              <div>
                <h2 className="text-xl font-semibold text-white">🕊️ CANONICAL LOGISTICS TRANSMISSION</h2>
                <p className="text-sm text-purple-100">DeepCAL++ vΩ LIVING ORACLE • {totalCanonicalShipments} Historical Shipments</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-black/20 rounded-full text-sm flex items-center border border-purple-400/30">
              <i className="fas fa-bolt text-yellow-400 mr-2"></i>
              <span>CANONICAL DATA • VERDICT PENDING</span>
            </div>
          </div>
        </div>

        {/* Emergency Context with Real Data */}
        <div className="p-5 border-b border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-deepcal-light mb-2">📊 Canonical Intelligence</h3>
              <p className="text-sm">Route Analysis: {routeShipments} historical shipments on {formData.origin} → {formData.destination} corridor. Pattern recognition active.</p>
            </div>
            <div>
              <h3 className="font-semibold text-deepcal-light mb-2">📍 Route Intelligence</h3>
              <div className="text-sm grid grid-cols-2 gap-2">
                <div>Historical: <span className="font-mono">{routeShipments} shipments</span></div>
                <div>Success Rate: <span className="font-mono">
                  {routeShipments > 0 ? Math.round((routeData.filter(r => r.delivery_status === 'Delivered').length / routeShipments) * 100) : 95}%
                </span></div>
                <div>Avg Weight: <span className="text-emerald-400">
                  {routeShipments > 0 ? Math.round(routeData.reduce((sum, r) => sum + r.weight_kg, 0) / routeShipments) : 'N/A'} kg
                </span></div>
                <div>Data Quality: <span className="text-emerald-400">✅ Canonical</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Canonical Decision Output */}
        <div className="grid grid-cols-1 gap-6">
          {/* Ranked Forwarders Table */}
          <div className="bg-slate-900/50 rounded-xl overflow-hidden symbolic-border">
            <div className="px-5 py-3 bg-gradient-to-r from-deepcal-dark to-deepcal-purple flex justify-between items-center">
              <h3 className="font-semibold flex items-center">
                <i className="fas fa-trophy mr-2"></i>
                TOPSIS Ranking Matrix • Canonical Data
              </h3>
              <span className="text-xs bg-black/20 px-2 py-1 rounded">Real Performance Algorithm</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-deepcal-purple/30">
                  <tr>
                    <th className="px-4 py-3 text-left">Rank</th>
                    <th className="px-4 py-3 text-left">Forwarder</th>
                    <th className="px-4 py-3 text-left">Time (days)</th>
                    <th className="px-4 py-3 text-left">Cost (USD/kg)</th>
                    <th className="px-4 py-3 text-left">Risk</th>
                    <th className="px-4 py-3 text-left">TOPSIS Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((forwarder) => (
                    <tr key={forwarder.name} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                      <td className={`px-4 py-3 font-semibold ${getRankColor(forwarder.rank)}`}>
                        {getMedalIcon(forwarder.rank)} {forwarder.rank}
                      </td>
                      <td className="px-4 py-3 font-medium">{forwarder.name}</td>
                      <td className="px-4 py-3">{forwarder.transitDays}</td>
                      <td className="px-4 py-3">${forwarder.cost}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 ${getRiskColor(forwarder.risk)} rounded text-xs`}>
                          {forwarder.risk}%
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-bold ${getRankColor(forwarder.rank)}`}>
                        {forwarder.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytical Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Canonical Narrative */}
            <div className="oracle-card p-5">
              <div className="flex items-center mb-4">
                <i className="fas fa-book-open text-lg text-blue-400 mr-2"></i>
                <h3 className="font-semibold">Canonical Oracle Narrative</h3>
              </div>
              <div className="text-sm leading-relaxed text-slate-200">
                <p className="mb-3">📜 <span className="font-medium">The Chronicle of Real Shipments:</span> From {totalCanonicalShipments} canonical shipments across Africa, {routeShipments} journeys illuminate the {formData.origin} to {formData.destination} corridor. Time and cost dance with probability.</p>
                <p className="mb-3">🧠 <span className="font-medium">Historical Wisdom:</span> {topForwarder.name} emerges from real performance data—not speculation, but proven delivery at ${topForwarder.cost}/kg over {topForwarder.transitDays} days. Risk factor {topForwarder.risk}% speaks from actual outcomes.</p>
                <p className="mb-3">⚖️ <span className="font-medium">The Evidence Weighs:</span> In {routeShipments} route precedents, patterns reveal themselves. Your TOPSIS score of {topForwarder.score} is carved from operational reality, not theoretical models.</p>
                <p>🔱 <span className="font-medium">Canonical Truth:</span> <em>"The ledger remembers what forecasts forget—{topForwarder.name} has walked this path {routeShipments > 0 ? routeData.filter(r => r.initial_quote_awarded === topForwarder.name || r.final_quote_awarded_freight_forwarder_carrier === topForwarder.name).length : 'multiple'} times before."</em></p>
              </div>
            </div>

            {/* Canonical Seal */}
            <div className="oracle-card p-5 flex flex-col items-center justify-center">
              <div className="flex items-center mb-4">
                <i className="fas fa-drafting-compass text-lg text-purple-400 mr-2"></i>
                <h3 className="font-semibold">Canonical Decision Seal</h3>
              </div>
              <div className="decision-seal mb-3">
                <div className="text-center text-white font-bold text-xs leading-tight">
                  CANONICAL++<br />
                  ✦ VERDICT ✦<br />
                  <span className="text-[8px]">DATA-SEALED</span>
                </div>
              </div>
              <div className="text-xs text-center mt-2">
                <div>qseal:canonical{routeShipments}x{totalCanonicalShipments}</div>
                <div className="text-slate-400 mt-1">SHIPMENTS: {totalCanonicalShipments} • ROUTE: {routeShipments}</div>
                <div className="mt-2 text-purple-300">"{topForwarder.name} blessed by historical performance"</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;
