
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import InputPanel from '../components/InputPanel';
import OutputPanel from '../components/OutputPanel';
import Footer from '../components/Footer';
import { PredictiveTimeline } from '../components/analytics/PredictiveTimeline';
import { CompactRealTimePanel } from '../components/freight/CompactRealTimePanel';
import { canonicalShipmentData, getForwarderPerformance, getUniqueForwarders } from '../data/canonicalData';
import { FreightIntelligenceDashboard } from '../components/freight/FreightIntelligenceDashboard';

interface FormData {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  cargoType: string;
  selectedForwarders: string[];
}

interface ForwarderRanking {
  name: string;
  transitDays: number;
  cost: number;
  risk: number;
  score: number;
  rank: number;
}

const Index = () => {
  const [showOutput, setShowOutput] = useState(false);
  const [rankings, setRankings] = useState<ForwarderRanking[]>([]);
  const [formData, setFormData] = useState<FormData>({
    origin: 'Kenya',
    destination: 'Zambia',
    weight: 7850,
    volume: 24.5,
    cargoType: 'Emergency Health Kits',
    selectedForwarders: ['Kuehne Nagel', 'DHL Express', 'Siginon Logistics', 'Freight In Time']
  });

  // Normalize values between 0-1
  const normalize = (value: number, min: number, max: number) => {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  };

  // Rank forwarders using TOPSIS-like scoring with real canonical data
  const rankForwarders = (forwarders: string[]) => {
    const performances = forwarders.map(forwarder => {
      const performance = getForwarderPerformance(forwarder);
      return {
        name: forwarder,
        ...performance
      };
    });

    // Calculate min/max for normalization
    const costs = performances.map(p => p.avgCostPerKg).filter(c => c > 0);
    const transits = performances.map(p => p.avgTransitDays).filter(t => t > 0);
    const reliabilities = performances.map(p => p.reliabilityScore);

    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const minTransit = Math.min(...transits);
    const maxTransit = Math.max(...transits);
    const minReliability = Math.min(...reliabilities);
    const maxReliability = Math.max(...reliabilities);

    return performances.map(perf => ({
      name: perf.name,
      transitDays: perf.avgTransitDays || 7,
      cost: perf.avgCostPerKg || 4.5,
      risk: Math.round((1 - perf.onTimeRate) * 100) || 15,
      score: (
        0.68 * (1 - normalize(perf.avgTransitDays || 7, minTransit, maxTransit)) +
        0.45 * (1 - normalize(perf.avgCostPerKg || 4.5, minCost, maxCost)) +
        0.22 * normalize(perf.reliabilityScore || 80, minReliability, maxReliability)
      )
    }))
    .sort((a, b) => b.score - a.score)
    .map((forwarder, index) => ({
      ...forwarder,
      rank: index + 1,
      transitDays: Number(forwarder.transitDays.toFixed(1)),
      cost: Number(forwarder.cost.toFixed(2)),
      score: Number(forwarder.score.toFixed(2))
    }));
  };

  const handleOracleAwaken = () => {
    console.log('Oracle awakening with canonical data:', formData);
    
    // Use real canonical data for rankings
    const ranked = rankForwarders(formData.selectedForwarders);
    console.log('Calculated rankings from canonical data:', ranked);
    
    setRankings(ranked);
    setShowOutput(true);
    
    // Smooth scroll to output after a brief delay
    setTimeout(() => {
      const outputElement = document.getElementById('outputPanel');
      if (outputElement) {
        outputElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  useEffect(() => {
    // Initialize animations
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.oracle-card, header');
      elements.forEach(el => {
        el.classList.add('animate-fade-in');
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
        {showOutput && (
              <div className="lg:col-span-2 animate-scroll-appear" id="outputPanel">
                <FreightIntelligenceDashboard
                  origin={formData.origin}
                  destination={formData.destination}
                  cargoType={formData.cargoType}
                  weight={formData.weight}
                  volume={formData.volume}
                />
              </div>
            )}
          </div>
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Input Panel + Real-Time Analytics */}
            
            <div className="space-y-6">
              <InputPanel 
                onOracleAwaken={handleOracleAwaken}
                formData={formData}
                onFormChange={setFormData}
              />
              
          {showOutput && (
            <div className="mt-4">
              <PredictiveTimeline />
              <CompactRealTimePanel />
            </div>
          )}
          
          {showOutput && (
            <div className="mt-6 text-center text-sm text-slate-400">
              DeepCAL++ vΩ • Symbolic Freight Intelligence Engine • Powered by Canonical Data • First Transmission: {new Date().toISOString().split('T')[0]}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
