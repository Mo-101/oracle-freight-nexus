
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuantumParticles from '../components/QuantumParticles';
import HolographicCard from '../components/HolographicCard';
import SymbolicStatusOrb from '../components/SymbolicStatusOrb';
import QuantumTrainingProgress from '../components/QuantumTrainingProgress';
import { QuantumOptimizationMatrix } from '../components/QuantumOptimizationMatrix';
import { RiskHeatmap } from '../components/analytics/RiskHeatmap';
import { ForwarderPerformance } from '../types/deeptrack';
import AnimatedNodeOracle from '../components/oracle/AnimatedNodeOracle';
import { AnimatedQuantumOrb } from '../components/quantum/AnimatedQuantumOrb';
import { MCPAnalyticsDashboard } from '../components/quantum/MCPAnalyticsDashboard';

const Quantum = () => {
  const [formData, setFormData] = useState({
    origin: 'Nairobi, Kenya',
    destination: 'Lagos, Nigeria',
    weight: '500',
    volume: '2.5',
    priority: 'Medical Supplies (Q-Priority 9)',
    emergency: false
  });

  // Mock forwarder data with quantum-themed names
  const quantumForwarders: ForwarderPerformance[] = [
    { name: 'Quantum Express', avgCostPerKg: 2.4, avgTransitDays: 1.8, reliabilityScore: 96.2, quoteWinRate: 0.89 },
    { name: 'Neural Logistics', avgCostPerKg: 1.9, avgTransitDays: 2.3, reliabilityScore: 94.8, quoteWinRate: 0.76 },
    { name: 'Oracle Freight', avgCostPerKg: 2.8, avgTransitDays: 1.2, reliabilityScore: 98.1, quoteWinRate: 0.92 },
    { name: 'Cosmic Carriers', avgCostPerKg: 1.6, avgTransitDays: 3.1, reliabilityScore: 89.5, quoteWinRate: 0.65 },
    { name: 'Symbolic Transport', avgCostPerKg: 2.1, avgTransitDays: 2.7, reliabilityScore: 91.2, quoteWinRate: 0.71 },
    { name: 'Ethereal Express', avgCostPerKg: 3.2, avgTransitDays: 0.9, reliabilityScore: 99.3, quoteWinRate: 0.95 }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleOptimize = () => {
    console.log('Executing quantum optimization with:', formData);
  };

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
                  <i className="fas fa-infinity text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-deepcal-light to-white">
                    DeepCAL++ Quantum Decision Matrix
                  </h1>
                  <p className="text-slate-400 mt-1">
                    Real-time AI-powered optimization with MCP integration
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="oracle-card px-4 py-2 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                  <span className="text-sm text-slate-200">MCP Connected</span>
                </div>
                <div className="oracle-card px-4 py-2 flex items-center">
                  <i className="fas fa-database text-deepcal-light mr-2"></i>
                  <span className="text-sm text-slate-200">v2.1.0-quantum+mcp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantum Oracle Engine - New Animated Node Visualization */}
          <div className="mb-16">
            <div className="oracle-card p-6">
              <h2 className="text-2xl font-bold text-deepcal-light mb-6 flex items-center">
                <i className="fas fa-atom mr-3"></i>
                Quantum Oracle Processing Engine
              </h2>
              <div className="h-96">
                <AnimatedNodeOracle />
              </div>
            </div>
          </div>

          {/* MCP Analytics Dashboard - Real-time AI-driven outputs */}
          <div className="mb-16">
            <MCPAnalyticsDashboard 
              shipmentData={{
                origin: formData.origin,
                destination: formData.destination,
                cargoType: formData.priority,
                weight: parseFloat(formData.weight) || 500,
                volume: parseFloat(formData.volume) || 2.5
              }}
            />
          </div>

          {/* Quantum Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {/* Data Input Quantum Node */}
            <HolographicCard className="w-full h-80" animationClass="animate-float">
              <div className="oracle-card p-6 h-full flex flex-col justify-between">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-deepcal-purple flex items-center justify-center mr-3 glowing-border">
                    <i className="fas fa-dna text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-deepcal-light text-lg">Quantum Data Input</h3>
                    <div className="text-xs text-slate-400">Real-time Dataset Integration</div>
                  </div>
                </div>
                <div className="text-xs text-slate-300 space-y-2 flex-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">MCP Integration</span>
                    <span className="text-green-400">✓ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data Streams</span>
                    <span className="text-green-400">✓ Live</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Model Predictions</span>
                    <span className="text-deepcal-light">Real-time</span>
                  </div>
                </div>
              </div>
            </HolographicCard>

            {/* Quantum Preprocessor */}
            <HolographicCard className="w-full h-80" animationClass="animate-float-2">
              <div className="oracle-card p-6 h-full flex flex-col justify-between">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-deepcal-light flex items-center justify-center mr-3 glowing-border">
                    <i className="fas fa-microchip text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-deepcal-light text-lg">AI Model Engine</h3>
                    <div className="text-xs text-slate-400">Neural Network Processing</div>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                      <span className="text-xs text-slate-300">Model Inference</span>
                    </div>
                    <span className="text-xs font-mono text-green-400">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-deepcal-light mr-2 animate-pulse"></div>
                      <span className="text-xs text-slate-300">Feature Engineering</span>
                    </div>
                    <span className="text-xs font-mono text-deepcal-light">Live</span>
                  </div>
                </div>
              </div>
            </HolographicCard>

            {/* Quantum Analytics Core */}
            <HolographicCard className="w-full h-80" animationClass="animate-float-3">
              <div className="oracle-card p-6 h-full flex flex-col justify-between">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-3 glowing-border">
                    <i className="fas fa-brain text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-300 text-lg">MCP Intelligence</h3>
                    <div className="text-xs text-slate-400">Multi-Modal AI Context</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs flex-1">
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-600/50">
                    <div className="text-deepcal-light mb-1">Research Papers</div>
                    <div className="font-mono text-slate-200">Live <span className="text-green-400">Analysis</span></div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-600/50">
                    <div className="text-deepcal-light mb-1">ML Models</div>
                    <div className="font-mono text-slate-200">Auto <span className="text-green-400">Discovery</span></div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-600/50">
                    <div className="text-deepcal-light mb-1">AI Insights</div>
                    <div className="font-mono text-slate-200">Real-time <span className="text-green-400">Gen</span></div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-600/50">
                    <div className="text-deepcal-light mb-1">Context</div>
                    <div className="font-mono text-slate-200">Dynamic <span className="text-green-400">Update</span></div>
                  </div>
                </div>
              </div>
            </HolographicCard>
          </div>

          {/* Quantum Consciousness Row - Oracle Mindstream & Training Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <SymbolicStatusOrb />
            <QuantumTrainingProgress />
          </div>

          {/* Enhanced Animated Quantum Decision Orb */}
          <AnimatedQuantumOrb />
          
          {/* Status Bar */}
          <div className="oracle-card p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-8 h-8 rounded-full bg-deepcal-purple flex items-center justify-center mr-3">
                  <i className="fas fa-shield-alt text-white text-sm"></i>
                </div>
                <div className="text-sm">
                  <div className="text-deepcal-light font-medium">MCP Quantum Security Protocol</div>
                  <div className="text-xs text-slate-400">All AI computations secured with quantum encryption</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-xs font-mono bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/30">
                  <span className="text-deepcal-light">MCP:</span> <span className="text-slate-200">Connected</span>
                </div>
                <div className="text-xs font-mono bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/30">
                  <span className="text-green-400">AI Models:</span> <span className="text-slate-200">Live</span>
                </div>
                <div className="text-xs font-mono bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/30">
                  <span className="text-deepcal-light">Analytics:</span> <span className="text-slate-200">Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Quantum;
