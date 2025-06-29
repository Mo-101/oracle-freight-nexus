
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuantumParticles from '../components/QuantumParticles';
import { Interactive3DGlobe } from '../components/Interactive3DGlobe';
import { PredictiveTimeline } from '../components/analytics/PredictiveTimeline';
import { RiskHeatmap } from '../components/analytics/RiskHeatmap';

const Globe = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <QuantumParticles />
      
      <main className="flex-1 py-8 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-deepcal-purple to-deepcal-light flex items-center justify-center glowing-border">
                  <i className="fas fa-globe text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-deepcal-light to-white">
                    DeepCAL++ Global Intelligence
                  </h1>
                  <p className="text-slate-400 mt-1">
                    3D visualization of quantum supply chain consciousness
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="oracle-card px-4 py-2 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                  <span className="text-sm text-slate-200">Global Tracking Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Globe - Main Feature */}
          <div className="mb-12">
            <div className="oracle-card p-6">
              <h2 className="text-2xl font-bold text-deepcal-light mb-6 flex items-center">
                <span className="mr-3">🌍</span>
                Quantum Shipment Consciousness Field
              </h2>
              <Interactive3DGlobe />
              <div className="mt-4 text-center text-sm text-slate-400">
                Click and drag to rotate • Scroll to zoom • Hover markers for details
              </div>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PredictiveTimeline />
            <RiskHeatmap />
          </div>

          {/* Legend */}
          <div className="mt-8 oracle-card p-6">
            <h3 className="text-lg font-bold text-deepcal-light mb-4">Quantum Field Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-deepcal-light mr-2"></div>
                <span>Origin Points</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-deepcal-purple mr-2"></div>
                <span>Destination Points</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-1 bg-deepcal-purple mr-2"></div>
                <span>Active Routes</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Globe;
