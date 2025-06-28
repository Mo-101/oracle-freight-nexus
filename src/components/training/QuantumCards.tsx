
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import HolographicCard from '../HolographicCard';

export const QuantumDataInputCard = () => {
  return (
    <HolographicCard className="w-72" animationClass="animate-float">
      <div className="oracle-card p-5">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-deepcal-purple flex items-center justify-center mr-3 glowing-border">
            <i className="fas fa-dna text-white text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-deepcal-light text-lg">Quantum Data Input</h3>
            <div className="text-xs text-slate-400">Emergency Health Kits Dataset</div>
          </div>
        </div>
        <div className="text-xs text-slate-300 space-y-2">
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
  );
};

export const QuantumPreprocessorCard = () => {
  return (
    <HolographicCard className="w-72" animationClass="animate-float-2">
      <div className="oracle-card p-5">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-deepcal-light flex items-center justify-center mr-3 glowing-border">
            <i className="fas fa-microchip text-white text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-deepcal-light text-lg">Quantum Preprocessor</h3>
            <div className="text-xs text-slate-400">Parallel Dimension Reduction</div>
          </div>
        </div>
        <div className="space-y-3">
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
  );
};

export const QuantumAnalyticsCard = () => {
  return (
    <HolographicCard className="w-80" animationClass="animate-float-3">
      <div className="oracle-card p-5">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-3 glowing-border">
            <i className="fas fa-brain text-white text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-blue-300 text-lg">Quantum Analytics Core</h3>
            <div className="text-xs text-slate-400">Neural Quantum Network</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
            <div className="text-deepcal-light mb-1">Avg Transit</div>
            <div className="font-mono text-slate-200">2.4d <span className="text-green-400">(-18%)</span></div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
            <div className="text-deepcal-light mb-1">Cost Efficiency</div>
            <div className="font-mono text-slate-200">$0.98/kg <span className="text-green-400">(+9.5%)</span></div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
            <div className="text-deepcal-light mb-1">Reliability</div>
            <div className="font-mono text-slate-200">96.2% <span className="text-green-400">(+4.2pp)</span></div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
            <div className="text-deepcal-light mb-1">Risk Factor</div>
            <div className="font-mono text-slate-200">3.8% <span className="text-green-400">(-4.2pp)</span></div>
          </div>
        </div>
      </div>
    </HolographicCard>
  );
};

export const QuantumInterfaceCard = () => {
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
    <HolographicCard className="w-96" animationClass="animate-float-4">
      <div className="oracle-card p-5">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mr-3 glowing-border">
            <i className="fas fa-terminal text-white text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-green-300 text-lg">Quantum Interface</h3>
            <div className="text-xs text-slate-400">Real-time Optimization</div>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-deepcal-light mb-1">Origin Coordinates</label>
            <input 
              type="text" 
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-sm font-mono text-slate-200 focus:border-deepcal-light focus:outline-none" 
              placeholder="Qx: 0.42, Qy: 0.78"
            />
          </div>
          <div>
            <label className="block text-xs text-deepcal-light mb-1">Destination Field</label>
            <input 
              type="text" 
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-sm font-mono text-slate-200 focus:border-deepcal-light focus:outline-none" 
              placeholder="Enter quantum coordinates"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-deepcal-light mb-1">Mass (kg)</label>
              <input 
                type="number" 
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-sm font-mono text-slate-200 focus:border-deepcal-light focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-deepcal-light mb-1">Volume (qbm)</label>
              <input 
                type="number" 
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-sm font-mono text-slate-200 focus:border-deepcal-light focus:outline-none"
              />
            </div>
          </div>
          <button 
            onClick={handleOptimize}
            className="w-full bg-gradient-to-r from-deepcal-purple to-deepcal-light hover:from-deepcal-dark hover:to-deepcal-purple text-white py-3 px-4 rounded text-sm font-bold transition-all duration-300 transform hover:scale-[1.01] active:scale-95 flex items-center justify-center glowing-border"
          >
            <i className="fas fa-bolt mr-2"></i>
            Execute Quantum Optimization
          </button>
        </div>
      </div>
    </HolographicCard>
  );
};
