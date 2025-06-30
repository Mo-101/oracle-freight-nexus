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

const Quantum = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight: '',
    volume: '',
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
                    Optimizing supply chains at quantum speed with Grey-AHP-TOPSIS
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="oracle-card px-4 py-2 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                  <span className="text-sm text-slate-200">Quantum Core Online</span>
                </div>
                <div className="oracle-card px-4 py-2 flex items-center">
                  <i className="fas fa-database text-deepcal-light mr-2"></i>
                  <span className="text-sm text-slate-200">v2.1.0-quantum</span>
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
                    <div className="text-xs text-slate-400">Emergency Health Kits Dataset</div>
                  </div>
                </div>
                <div className="text-xs text-slate-300 space-y-2 flex-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quantum Entanglement</span>
                    <span className="text-green-400">✓ Superpositioned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data Integrity</span>
                    <span className="text-green-400">✓ Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Qubits Allocated</span>
                    <span className="text-deepcal-light">1,024</span>
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
                    <h3 className="font-bold text-deepcal-light text-lg">Quantum Preprocessor</h3>
                    <div className="text-xs text-slate-400">Parallel Dimension Reduction</div>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                      <span className="text-xs text-slate-300">Quantum Validation</span>
                    </div>
                    <span className="text-xs font-mono text-green-400">99.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-deepcal-light mr-2 animate-pulse"></div>
                      <span className="text-xs text-slate-300">Entanglement Mapping</span>
                    </div>
                    <span className="text-xs font-mono text-deepcal-light">64q</span>
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
                    <h3 className="font-bold text-blue-300 text-lg">Quantum Analytics Core</h3>
                    <div className="text-xs text-slate-400">Neural Quantum Network</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs flex-1">
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-600/50">
                    <div className="text-deepcal-light mb-1">Avg Transit</div>
                    <div className="font-mono text-slate-200">2.4d <span className="text-green-400">(-18%)</span></div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-600/50">
                    <div className="text-deepcal-light mb-1">Cost Efficiency</div>
                    <div className="font-mono text-slate-200">$0.98/kg <span className="text-green-400">(+9.5%)</span></div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-600/50">
                    <div className="text-deepcal-light mb-1">Reliability</div>
                    <div className="font-mono text-slate-200">96.2% <span className="text-green-400">(+4.2pp)</span></div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-600/50">
                    <div className="text-deepcal-light mb-1">Risk Factor</div>
                    <div className="font-mono text-slate-200">3.8% <span className="text-green-400">(-4.2pp)</span></div>
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

          {/* Analytics and Visualization Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* 3D Quantum Optimization Matrix */}
            <HolographicCard className="w-full h-96" animationClass="animate-float">
              <div className="p-6 h-full">
                <QuantumOptimizationMatrix forwarders={quantumForwarders} />
              </div>
            </HolographicCard>

            {/* Risk Heatmap */}
            <div className="h-96">
              <RiskHeatmap />
            </div>
          </div>

          {/* Quantum Decision Orb - Centered */}
          <div className="flex justify-center mb-16">
            <div className="w-96 h-96 rounded-full oracle-card flex items-center justify-center animate-pulse">
              <div className="text-center relative">
                {/* Quantum particles orbiting */}
                <div className="absolute w-2 h-2 rounded-full bg-deepcal-light animate-bounce" style={{top: '-40px', left: '50px'}}></div>
                <div className="absolute w-2 h-2 rounded-full bg-deepcal-purple animate-bounce" style={{top: '30px', left: '-60px', animationDelay: '0.5s'}}></div>
                <div className="absolute w-2 h-2 rounded-full bg-deepcal-light animate-bounce" style={{top: '80px', left: '20px', animationDelay: '1s'}}></div>
                
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-deepcal-purple to-deepcal-light flex items-center justify-center mx-auto mb-4 glowing-border">
                  <i className="fas fa-infinity text-white text-3xl"></i>
                </div>
                <h3 className="font-bold text-2xl text-deepcal-light mb-2">Quantum Decision Orb</h3>
                <div className="text-xs text-slate-400 mb-4">Grey-Quantum AHP-TOPSIS</div>
                
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-deepcal-purple/30 animate-spin-slow"></div>
                  <div className="absolute inset-4 rounded-full border-2 border-deepcal-light/30 animate-spin-slow" style={{animationDirection: 'reverse'}}></div>
                  <div className="absolute inset-8 rounded-full border-2 border-slate-400/30 animate-spin-slow"></div>
                </div>
                
                <div className="text-xs text-slate-300">
                  <div className="mb-3 text-center font-mono text-deepcal-light">
                    "Collapsing wavefunctions for optimal decisions"
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-green-900/30 p-1 rounded border border-green-500/20">
                      <div className="text-green-300">#1</div>
                      <div className="font-bold text-white">Q4</div>
                      <div className="text-xs text-green-400">0.892</div>
                    </div>
                    <div className="bg-blue-900/30 p-1 rounded border border-blue-500/20">
                      <div className="text-blue-300">#2</div>
                      <div className="font-bold text-white">Q3</div>
                      <div className="text-xs text-blue-400">0.845</div>
                    </div>
                    <div className="bg-yellow-900/30 p-1 rounded border border-yellow-500/20">
                      <div className="text-yellow-300">#3</div>
                      <div className="font-bold text-white">Q1</div>
                      <div className="text-xs text-yellow-400">0.712</div>
                    </div>
                    <div className="bg-red-900/30 p-1 rounded border border-red-500/20">
                      <div className="text-red-300">#4</div>
                      <div className="font-bold text-white">Q2</div>
                      <div className="text-xs text-red-400">0.301</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="oracle-card p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-8 h-8 rounded-full bg-deepcal-purple flex items-center justify-center mr-3">
                  <i className="fas fa-shield-alt text-white text-sm"></i>
                </div>
                <div className="text-sm">
                  <div className="text-deepcal-light font-medium">Quantum Security Protocol</div>
                  <div className="text-xs text-slate-400">All computations encrypted with QKD</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-xs font-mono bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/30">
                  <span className="text-deepcal-light">Qubits:</span> <span className="text-slate-200">1,024/1,024</span>
                </div>
                <div className="text-xs font-mono bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/30">
                  <span className="text-green-400">Coherence:</span> <span className="text-slate-200">98.7%</span>
                </div>
                <div className="text-xs font-mono bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/30">
                  <span className="text-deepcal-light">Entanglement:</span> <span className="text-slate-200">64q</span>
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
