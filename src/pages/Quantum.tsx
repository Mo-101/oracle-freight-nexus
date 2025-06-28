
import React, { useState } from 'react';
import QuantumParticles from '../components/QuantumParticles';
import HolographicCard from '../components/HolographicCard';

const Quantum = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight: '',
    volume: '',
    priority: 'Medical Supplies (Q-Priority 9)',
    emergency: false
  });

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
    <div className="quantum-gradient text-gray-100 min-h-screen font-sans overflow-x-hidden">
      <QuantumParticles />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-14 h-14 rounded-full bg-quantum-700 flex items-center justify-center mr-4 quantum-ring animate-neon-glow">
              <i className="fas fa-infinity text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-quantum-400 to-neural-400 bg-clip-text text-transparent">
                DeepCAL++ <span className="text-xs align-top">vΩ Quantum Decision Matrix</span>
              </h1>
              <div className="text-xs text-quantum-300 font-mono mt-1">// Optimizing supply chains at quantum speed</div>
            </div>
            <div className="ml-4 px-3 py-1 bg-quantum-900/70 rounded-full text-xs font-mono border border-quantum-700/50 flex items-center">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neural-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neural-400"></span>
              </span>
              <span>Quantum Mode: Active</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="px-4 py-2 bg-dark-800/70 rounded-lg flex items-center border border-dark-600/50 backdrop-blur-sm">
              <div className="w-3 h-3 rounded-full bg-neural-400 mr-2 animate-pulse"></div>
              <span className="text-sm">Neural Core Online</span>
            </div>
            <div className="px-4 py-2 bg-dark-800/70 rounded-lg flex items-center border border-dark-600/50 backdrop-blur-sm">
              <i className="fas fa-database text-quantum-400 mr-2"></i>
              <span className="text-sm">v2.1.0-quantum</span>
            </div>
          </div>
        </header>

        {/* Main Visualization */}
        <div className="relative h-[600px] md:h-[800px] mb-16 rounded-xl overflow-hidden border border-dark-600/50 bg-dark-900/30 backdrop-blur-sm">
          {/* Quantum grid background */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          ></div>
          
          {/* Data Input Quantum Node */}
          <HolographicCard className="absolute top-8 left-8 w-72" animationClass="animate-float">
            <div className="bg-dark-800/80 p-5 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-quantum-600 flex items-center justify-center mr-3 quantum-ring">
                  <i className="fas fa-dna text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-quantum-300 text-lg">Quantum Data Input</h3>
                  <div className="text-xs text-quantum-200">Emergency Health Kits Dataset</div>
                </div>
              </div>
              <div className="text-xs text-dark-200 mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-dark-300">Quantum Entanglement</span>
                  <span className="text-neural-400">✓ Superpositioned</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-dark-300">Data Integrity</span>
                  <span className="text-neural-400">✓ Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-300">Qubits Allocated</span>
                  <span>1,024</span>
                </div>
              </div>
            </div>
          </HolographicCard>

          {/* Quantum Preprocessor */}
          <HolographicCard className="absolute top-32 left-1/3 w-72" animationClass="animate-float-2">
            <div className="bg-dark-800/80 p-5 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mr-3 quantum-ring">
                  <i className="fas fa-microchip text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-purple-300 text-lg">Quantum Preprocessor</h3>
                  <div className="text-xs text-purple-200">Parallel Dimension Reduction</div>
                </div>
              </div>
              <div className="space-y-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-neural-400 mr-2 animate-pulse"></div>
                    <span className="text-xs">Quantum Validation</span>
                  </div>
                  <span className="text-xs font-mono text-neural-400">99.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-neural-400 mr-2 animate-pulse"></div>
                    <span className="text-xs">Entanglement Mapping</span>
                  </div>
                  <span className="text-xs font-mono text-neural-400">64q</span>
                </div>
              </div>
            </div>
          </HolographicCard>

          {/* Quantum Analytics Core */}
          <HolographicCard className="absolute top-1/4 right-1/4 w-80" animationClass="animate-float-3">
            <div className="bg-dark-800/80 p-5 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-3 quantum-ring">
                  <i className="fas fa-brain text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-blue-300 text-lg">Quantum Analytics Core</h3>
                  <div className="text-xs text-blue-200">Neural Quantum Network</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-dark-900/50 p-2 rounded border border-dark-700/50">
                  <div className="text-blue-400 mb-1">Avg Transit</div>
                  <div className="font-mono">2.4d <span className="text-neural-400">(-18%)</span></div>
                </div>
                <div className="bg-dark-900/50 p-2 rounded border border-dark-700/50">
                  <div className="text-blue-400 mb-1">Cost Efficiency</div>
                  <div className="font-mono">$0.98/kg <span className="text-neural-400">(+9.5%)</span></div>
                </div>
                <div className="bg-dark-900/50 p-2 rounded border border-dark-700/50">
                  <div className="text-blue-400 mb-1">Reliability</div>
                  <div className="font-mono">96.2% <span className="text-neural-400">(+4.2pp)</span></div>
                </div>
                <div className="bg-dark-900/50 p-2 rounded border border-dark-700/50">
                  <div className="text-blue-400 mb-1">Risk Factor</div>
                  <div className="font-mono">3.8% <span className="text-neural-400">(-4.2pp)</span></div>
                </div>
              </div>
            </div>
          </HolographicCard>

          {/* Quantum Decision Orb */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-dark-800/70 backdrop-blur-sm border-2 border-quantum-500/50 flex items-center justify-center animate-neon-glow animate-wave">
            <div className="text-center relative">
              {/* Quantum particles orbiting */}
              <div className="quantum-dot" style={{top: '-40px', left: '50px'}}></div>
              <div className="quantum-dot" style={{top: '30px', left: '-60px'}}></div>
              <div className="quantum-dot" style={{top: '80px', left: '20px'}}></div>
              
              <div className="w-20 h-20 rounded-full bg-quantum-700 flex items-center justify-center mx-auto mb-4 quantum-ring">
                <i className="fas fa-infinity text-white text-3xl"></i>
              </div>
              <h3 className="font-bold text-2xl text-quantum-300 mb-2">Quantum Decision Orb</h3>
              <div className="text-xs text-quantum-200 mb-4">Grey-Quantum AHP-TOPSIS</div>
              
              <div className="relative w-28 h-28 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-quantum-500/30 animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border-2 border-quantum-400/30 animate-spin-slow" style={{animationDirection: 'reverse'}}></div>
                <div className="absolute inset-8 rounded-full border-2 border-quantum-300/30 animate-spin-slow"></div>
              </div>
              
              <div className="text-xs text-dark-200">
                <div className="mb-3 text-center font-mono text-quantum-300">
                  "Collapsing wavefunctions for optimal decisions"
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-neural-900/30 p-1 rounded border border-neural-500/20">
                    <div className="text-neural-300">#1</div>
                    <div className="font-bold">Q4</div>
                    <div className="text-xs">0.892</div>
                  </div>
                  <div className="bg-blue-900/30 p-1 rounded border border-blue-500/20">
                    <div className="text-blue-300">#2</div>
                    <div className="font-bold">Q3</div>
                    <div className="text-xs">0.845</div>
                  </div>
                  <div className="bg-yellow-900/30 p-1 rounded border border-yellow-500/20">
                    <div className="text-yellow-300">#3</div>
                    <div className="font-bold">Q1</div>
                    <div className="text-xs">0.712</div>
                  </div>
                  <div className="bg-red-900/30 p-1 rounded border border-red-500/20">
                    <div className="text-red-300">#4</div>
                    <div className="font-bold">Q2</div>
                    <div className="text-xs">0.301</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantum Interface Console */}
          <HolographicCard className="absolute bottom-8 right-8 w-96" animationClass="animate-float-4">
            <div className="bg-dark-800/80 p-5 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mr-3 quantum-ring">
                  <i className="fas fa-terminal text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-green-300 text-lg">Quantum Interface</h3>
                  <div className="text-xs text-green-200">Real-time Optimization</div>
                </div>
              </div>
              <div className="text-xs text-dark-200 mb-3">
                <div className="mb-2">
                  <label className="block text-xs text-quantum-300 mb-1">Origin Coordinates</label>
                  <input 
                    type="text" 
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    className="w-full bg-dark-900/50 border border-dark-700 rounded px-3 py-2 text-sm font-mono" 
                    placeholder="Qx: 0.42, Qy: 0.78"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs text-quantum-300 mb-1">Destination Field</label>
                  <input 
                    type="text" 
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full bg-dark-900/50 border border-dark-700 rounded px-3 py-2 text-sm font-mono" 
                    placeholder="Enter quantum coordinates"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-quantum-300 mb-1">Mass (kg)</label>
                    <input 
                      type="number" 
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full bg-dark-900/50 border border-dark-700 rounded px-3 py-2 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-quantum-300 mb-1">Volume (qbm)</label>
                    <input 
                      type="number" 
                      name="volume"
                      value={formData.volume}
                      onChange={handleInputChange}
                      className="w-full bg-dark-900/50 border border-dark-700 rounded px-3 py-2 text-sm font-mono"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-quantum-300 mb-1">Quantum Priority</label>
                  <select 
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-dark-900/50 border border-dark-700 rounded px-3 py-2 text-sm font-mono"
                  >
                    <option>Medical Supplies (Q-Priority 9)</option>
                    <option>Food Aid (Q-Priority 7)</option>
                    <option>Shelter Materials (Q-Priority 5)</option>
                    <option>Other (Q-Priority 3)</option>
                  </select>
                </div>
                <div className="flex items-center mb-4">
                  <input 
                    type="checkbox" 
                    id="quantum-emergency" 
                    name="emergency"
                    checked={formData.emergency}
                    onChange={handleInputChange}
                    className="mr-2 appearance-none w-4 h-4 border border-dark-500 rounded-sm bg-dark-700 checked:bg-neural-500 checked:border-neural-500"
                  />
                  <label htmlFor="quantum-emergency" className="text-xs text-red-400 font-mono">Quantum Emergency Override</label>
                </div>
                <button 
                  onClick={handleOptimize}
                  className="w-full bg-quantum-600 hover:bg-quantum-700 text-white py-3 px-4 rounded text-sm font-bold transition-all duration-300 transform hover:scale-[1.01] active:scale-95 flex items-center justify-center"
                >
                  <i className="fas fa-bolt mr-2"></i>
                  Execute Quantum Optimization
                </button>
              </div>
              <div className="mt-4 pt-3 border-t border-dark-700/50 data-stream">
                <div className="text-xs text-center text-dark-300">
                  <i className="fas fa-circle-notch fa-spin text-quantum-400 mr-1"></i>
                  Awaiting quantum computation results...
                </div>
              </div>
            </div>
          </HolographicCard>
          
          {/* Neural connections between nodes */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <svg className="absolute" width="100%" height="100%" style={{zIndex: 0}}>
              <line x1="280" y1="120" x2="380" y2="180" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="2" strokeDasharray="5,3" />
              <line x1="480" y1="200" x2="580" y2="150" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="2" strokeDasharray="5,3" />
              <line x1="650" y1="200" x2="700" y2="300" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="2" strokeDasharray="5,3" />
              <line x1="700" y1="400" x2="800" y2="500" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="2" strokeDasharray="5,3" />
            </svg>
          </div>
        </div>
        
        {/* Status Bar */}
        <footer className="mt-12 p-4 bg-dark-800/70 rounded-xl border border-dark-700/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-quantum-700 flex items-center justify-center mr-3">
                <i className="fas fa-shield-alt text-quantum-200 text-sm"></i>
              </div>
              <div className="text-sm">
                <div className="text-quantum-300">Quantum Security Protocol</div>
                <div className="text-xs text-dark-400">All computations encrypted with QKD</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-xs font-mono bg-dark-900/50 px-3 py-1 rounded-full border border-dark-700/30">
                <span className="text-quantum-400">Qubits:</span> 1,024/1,024
              </div>
              <div className="text-xs font-mono bg-dark-900/50 px-3 py-1 rounded-full border border-dark-700/30">
                <span className="text-neural-400">Coherence:</span> 98.7%
              </div>
              <div className="text-xs font-mono bg-dark-900/50 px-3 py-1 rounded-full border border-dark-700/30">
                <span className="text-purple-400">Entanglement:</span> 64q
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Quantum;
