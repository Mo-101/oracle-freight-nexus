
import React from 'react';
import { DataValidationPanel } from '@/components/deepcal/DataValidationPanel';
import { DeepCALEnginePanel } from '@/components/deepcal/DeepCALEnginePanel';
import { FreightIntelligenceDashboard } from '@/components/freight/FreightIntelligenceDashboard';

export default function Index() {
  // Sample data for freight intelligence (will be replaced by real data after validation)
  const sampleFreightData = {
    origin: "Nairobi",
    destination: "Lusaka", 
    cargoType: "Medical Supplies",
    weight: 2500,
    volume: 15.8
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔮 DeepCAL++ Quantum Oracle
          </h1>
          <p className="text-xl text-deepcal-light">
            Intelligent Emergency Logistics Decision-Support System
          </p>
          <p className="text-sm text-slate-400 mt-2">
            v1.0 • Neutrosophic AHP-TOPSIS Engine • Mostar Industries
          </p>
        </div>

        {/* Data Validation - First Priority */}
        <DataValidationPanel />

        {/* Core Decision Engine */}
        <DeepCALEnginePanel />

        {/* Freight Intelligence Dashboard */}
        <div className="oracle-card p-6">
          <h2 className="text-2xl font-bold text-deepcal-light mb-6">
            📊 Freight Intelligence Dashboard
          </h2>
          <FreightIntelligenceDashboard 
            origin={sampleFreightData.origin}
            destination={sampleFreightData.destination}
            cargoType={sampleFreightData.cargoType}
            weight={sampleFreightData.weight}
            volume={sampleFreightData.volume}
          />
        </div>

        {/* System Architecture Info */}
        <div className="oracle-card p-6">
          <h3 className="text-xl font-bold text-deepcal-light mb-4">
            🏗️ DeepCAL Architecture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-800/50 p-4 rounded">
              <h4 className="font-semibold text-blue-400 mb-2">Phase 1: Data-First Protocol</h4>
              <ul className="text-slate-300 space-y-1">
                <li>• Strict data validation</li>
                <li>• SHA256 versioning</li>
                <li>• Audit trail logging</li>
                <li>• Feature lockdown</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 p-4 rounded">
              <h4 className="font-semibold text-purple-400 mb-2">Phase 2: Core Engine</h4>
              <ul className="text-slate-300 space-y-1">
                <li>• Neutrosophic AHP</li>
                <li>• TOPSIS ranking</li>
                <li>• Consistency validation</li>
                <li>• Scientific rigor</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 p-4 rounded">
              <h4 className="font-semibold text-green-400 mb-2">Phase 3: Intelligence</h4>
              <ul className="text-slate-300 space-y-1">
                <li>• Real-time analytics</li>
                <li>• Continuous learning</li>
                <li>• Performance tracking</li>
                <li>• Decision support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
