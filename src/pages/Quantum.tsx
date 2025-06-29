
import React from 'react';
import { QuantumOptimizationMatrix } from '../components/QuantumOptimizationMatrix';
import { Header } from '../components/Header';
import { QuantumCards } from '../components/enhanced/QuantumCards';
import SymbolicStatusOrb from '../components/SymbolicStatusOrb';
import { getForwarderPerformance } from '../data/canonicalData';

const Quantum = () => {
  // Get sample forwarder data for the quantum matrix
  const sampleForwarders = [
    'Kuehne Nagel', 'DHL Express', 'DHL Global', 'Siginon Logistics'
  ].map(name => getForwarderPerformance(name));

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepcal-dark via-slate-900 to-deepcal-dark">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <QuantumOptimizationMatrix forwarders={sampleForwarders} />
          </div>
          <div className="space-y-6">
            <SymbolicStatusOrb />
            <QuantumCards />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quantum;
